import { createEmitter } from '../emitter'
import { stop } from '../helpers'
import { type ClientResumableConfig, type ResumableConfig, resumableConfig } from './config'
import { CHUNK_STATUS } from './constants'
import type { ResumableEvents } from './events'
import { ResumableFile } from './ResumableFile'
import type { FileWithPath, Nillable } from './types'
import { checkFile, findFiles, processItem } from './utils'

export class Resumable {
  private resumableFiles: ResumableFile[] = []

  private config: ResumableConfig

  private emitter

  inputsContainer: Nillable<HTMLElement> = undefined

  public constructor(config: ClientResumableConfig = {}) {
    this.config = { ...resumableConfig, ...config }
    this.emitter = createEmitter<ResumableEvents>()
  }

  // PROPERTIES
  public getFiles() {
    return this.resumableFiles
  }

  public getNativeFiles() {
    return this.resumableFiles.map((el) => el.getFile())
  }

  public getConfig() {
    return this.config
  }

  public on<E extends keyof ResumableEvents>(event: E, callback: ResumableEvents[E]) {
    return this.emitter.on(event, callback)
  }

  public emit<E extends keyof ResumableEvents>(event: E, ...args: Parameters<ResumableEvents[E]>) {
    return this.emitter.emit(event, ...args)
  }

  // PUBLIC METHODS
  public upload() {
    if (this.isUploading()) {
      return
    }

    const { simultaneousUploads } = this.config

    this.emit('uploadStart')

    for (let num = 1; num <= simultaneousUploads; num++) {
      this.uploadNextChunk()
    }
  }

  public pause() {
    this.resumableFiles.forEach((file) => {
      file.abort()
    })

    this.emit('pause')
  }

  public cancel() {
    this.emit('beforeCancel')

    this.resumableFiles.reverse().forEach((file) => {
      file.cancel()
    })

    this.emit('cancel')
  }

  public reset() {
    if (this.isUploading()) {
      return
    }

    this.resumableFiles = []
  }

  public getProgress() {
    let totalDone = 0
    let totalSize = 0

    // Возобновите загрузку всех фрагментов, загружаемых в данный момент
    this.resumableFiles.forEach((resumableFile) => {
      totalDone += resumableFile.getProgress() * resumableFile.getSize()
      totalSize += resumableFile.getSize()
    })

    return totalSize > 0 ? totalDone / totalSize : 0
  }

  public addFile(file: File, event: Event) {
    this.appendFilesFromFileList([{ file, relativePath: '' }], event)
  }

  public addFiles(files: FileList | File[], event: Event) {
    const filesWithPath: FileWithPath[] = [...files].map((file) => ({ file, relativePath: '' }))

    this.appendFilesFromFileList([...filesWithPath], event)
  }

  public removeFile(file: ResumableFile) {
    for (let i = this.resumableFiles.length - 1; i >= 0; i--) {
      const el = this.resumableFiles[i]

      if (el === file) {
        this.resumableFiles.splice(i, 1)

        return
      }
    }
  }

  public getResumableFileByUid(uniqId: string) {
    return this.resumableFiles.find((file) => file.getUniqueId() === uniqId)
  }

  public loadFiles(items: Array<File | FileSystemEntry | DataTransferItem>, event: DragEvent) {
    if (items.length === 0) {
      return
    }

    this.emit('beforeAdd')
    const files: FileWithPath[] = []

    findFiles(
      items.map((item) => processItem.bind(null, item, '', files)),
      () => {
        if (files.length > 0) {
          // найден по крайней мере один файл
          this.appendFilesFromFileList(files, event)
        }
      },
    )
  }

  public appendFilesFromFileList = async (fileList: FileWithPath[], event: Event) => {
    const { maxFiles, maxFilesErrorCallback, generateUniqId } = this.config

    if (maxFiles !== undefined && maxFiles < fileList.length + this.resumableFiles.length) {
      // при загрузке одного файла файл уже добавлен,
      // и при попытке добавить 1 новый файл просто замените уже добавленный файл
      if (maxFiles === 1 && this.resumableFiles.length === 1 && fileList.length === 1) {
        this.removeFile(this.resumableFiles[0])
      } else {
        maxFilesErrorCallback(fileList, maxFiles)

        return
      }
    }

    const newFiles: ResumableFile[] = []
    const skippedFiles: FileWithPath[] = []
    let remainingCount = fileList.length

    const decreaseRemaining = () => {
      remainingCount -= 1

      if (remainingCount) {
        return
      }

      // нет успешных файлов, просто пропустите
      if (newFiles.length === 0 && skippedFiles.length === 0) {
        return
      }

      setTimeout(() => {
        this.emit('filesAdded', newFiles, skippedFiles)
      }, 0)
    }

    for (const fileWithPath of fileList) {
      if (!checkFile(fileWithPath.file, this.config)) {
        // TODO
        return
      }

      const addNewFile = (uniqId: string) => {
        if (!this.getResumableFileByUid(uniqId)) {
          const resumableFile = new ResumableFile(this, fileWithPath, uniqId)

          newFiles.push(resumableFile)
          this.resumableFiles.push(resumableFile)
          setTimeout(() => {
            this.emit('fileAdded', resumableFile, event)
          }, 0)
        } else {
          skippedFiles.push(fileWithPath)
        }

        decreaseRemaining()
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        const fileUniqId = await generateUniqId(fileWithPath, event)

        addNewFile(fileUniqId)
      } catch {
        decreaseRemaining()
      }
    }

    // TODO
    // return
  }

  // HANDLE
  public async handleInputChange(evt: Event) {
    const target = evt.target as HTMLInputElement

    const files: FileWithPath[] = (target.files ? [...target.files] : []).map((file) => ({ file, relativePath: '' }))

    await this.appendFilesFromFileList(files, evt)
    const { clearInput } = this.config

    if (clearInput) {
      target.value = ''
    }
  }

  public handleDrop(evt: DragEvent) {
    stop(evt)

    if (evt.dataTransfer && evt.dataTransfer.items) {
      this.loadFiles([...evt.dataTransfer.items], evt)
    } else if (evt.dataTransfer && evt.dataTransfer.files) {
      this.loadFiles([...evt.dataTransfer.files], evt)
    }
  }

  // OTHER
  public isUploading() {
    return this.resumableFiles.every((resumableFile) => resumableFile.isUploading())
  }

  public getSize() {
    return this.resumableFiles.reduce((totalSize, resumableFile) => totalSize + resumableFile.getSize(), 0)
  }

  // QUEUE
  public uploadNextChunk() {
    // В некоторых случаях (например, для видео) действительно удобно быстро загрузить первый
    // и последний фрагменты файла; это позволяет серверу проверить метаданные файла
    // и определить, есть ли вообще смысл продолжать.
    const { prioritizeFirstAndLastChunk } = this.config

    if (prioritizeFirstAndLastChunk) {
      const isSuccess = this.sendFistOrLastChunkForFiles()

      if (isSuccess) {
        return
      }
    }

    // Теперь просто найдите следующий, лучший для загрузки
    for (const resumableFile of this.resumableFiles) {
      if (resumableFile.isPause()) {
        // eslint-disable-next-line no-continue
        continue
      }

      for (const chunk of resumableFile.getChunks()) {
        if (chunk.getStatus() === CHUNK_STATUS.PENDING) {
          chunk.send()

          return
        }
      }
    }

    // Больше нет незавершенных фрагментов для загрузки, проверьте, все ли сделано
    if (!this.isComplete()) {
      return
    }

    // Все фрагменты были загружены, завершены
    this.emit('complete')
  }

  public isComplete() {
    for (const file of this.resumableFiles) {
      if (!file.isComplete()) {
        return false
      }
    }

    return true
  }

  private sendFistOrLastChunkForFiles() {
    for (const resumableFile of this.resumableFiles) {
      if (resumableFile.getChunks().length > 0 && resumableFile.getChunks()[0].getStatus() === CHUNK_STATUS.PENDING) {
        resumableFile.getChunks()[0].send()

        return true
      }

      if (
        resumableFile.getChunks().length > 1 &&
        resumableFile.getChunks().at(-1)?.getStatus() === CHUNK_STATUS.PENDING
      ) {
        resumableFile.getChunks().at(-1)?.send()

        return true
      }
    }

    return false
  }
}
