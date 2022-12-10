import type { ResumableConfig } from '../config/resumableConfig'
import { type CHUNK_STATUS_VALUES, CHUNK_STATUS } from '../constants/chunkStatus'
import type { Nillable } from '../helpers'
import type { Resumable } from './Resumable'
import type { ResumableFile } from './ResumableFile'

export class ResumableChunk {
  private offset: number

  private pendingRetry = false

  private startByte: number

  private endByte: number

  private hasBeenTested = false

  private retriesCount = 0

  private loaded = 0

  private lastProgressCallback = performance.now()

  private config: ResumableConfig

  private resumable: Resumable

  private resumableFile: ResumableFile

  private status: CHUNK_STATUS_VALUES

  private controller: Nillable<AbortController> = undefined

  public constructor(resumable: Resumable, resumableFile: ResumableFile, offset: number) {
    this.resumable = resumable
    this.resumableFile = resumableFile
    this.config = resumable.getConfig()
    this.offset = offset
    this.startByte = this.offset * this.config.chunkSize
    this.endByte = Math.min(resumableFile.getSize(), (this.offset + 1) * this.config.chunkSize)
    this.status = CHUNK_STATUS.PENDING

    if (resumableFile.getSize() - this.endByte < this.config.chunkSize && !this.config.forceChunkSize) {
      // Последний фрагмент будет больше, чем размер фрагмента, но меньше, чем 2 * Размер фрагмента
      this.endByte = resumableFile.getSize()
    }
  }

  // FIELDS
  public getEndByte() {
    return this.endByte
  }

  public getStartByte() {
    return this.startByte
  }

  public getOffset() {
    return this.offset
  }

  public getController() {
    return this.controller
  }

  public getResumableFile() {
    return this.resumableFile
  }

  public getResumable() {
    return this.resumable
  }

  public getStatus() {
    return this.status
  }

  // METHODS
  public abort() {
    this.controller?.abort()
  }

  public send() {
    const { testChunks, handleSendChunk } = this.config

    this.status = CHUNK_STATUS.UPLOADING

    if (testChunks && !this.hasBeenTested) {
      this.test()

      return
    }

    this.loaded = 0
    this.pendingRetry = false
    this.resumableFile.handleChunkProgress()

    if (!handleSendChunk) {
      throw new Error('Не найден обработчик `handleSendChunk`')
    }

    this.controller = new AbortController()
    this.resumableFile.handleChunkProgress()
    handleSendChunk(this)
  }

  public doneSend(isSuccess: boolean, isPermanentError = false, response: unknown = undefined) {
    this.controller = undefined

    if (isSuccess) {
      this.status = CHUNK_STATUS.SUCCESS
      this.resumableFile.handleChunkSuccess()
      this.resumable.uploadNextChunk()

      return
    }

    if (isPermanentError || this.isPermanentError()) {
      this.status = CHUNK_STATUS.ERROR
      this.resumableFile.handleChunkError(response)
      this.resumable.uploadNextChunk()

      return
    }

    this.retrySend()
  }

  public doneAbort() {
    this.controller = undefined

    this.status = CHUNK_STATUS.PENDING
  }

  private test() {
    const { handleTestChunk } = this.config

    if (!handleTestChunk) {
      throw new Error('Не найден обработчик `handleTestChunk`')
    }

    this.controller = new AbortController()
    handleTestChunk(this)
  }

  public doneTest(isAlreadyHas: boolean, response: unknown = undefined) {
    this.controller = undefined
    this.hasBeenTested = true

    if (isAlreadyHas) {
      this.resumableFile.handleChunkSuccess(response)
      this.resumable.uploadNextChunk()

      return
    }

    this.send()
  }

  public getRequestParams(): Record<string, string> {
    const list = [
      [this.config.chunkNumberParameterName, this.offset + 1],
      [this.config.chunkSizeParameterName, this.config.chunkSize],
      [this.config.currentChunkSizeParameterName, this.endByte - this.startByte],
      [this.config.totalSizeParameterName, this.resumableFile.getSize()],
      [this.config.typeParameterName, this.resumableFile.getType()],
      [this.config.identifierParameterName, this.resumableFile.getUniqueId()],
      [this.config.fileNameParameterName, this.resumableFile.getName()],
      [this.config.relativePathParameterName, this.resumableFile.getPath()],
      [this.config.totalChunksParameterName, this.resumableFile.getChunks().length],
    ].filter(([_, val]) => Boolean(val))

    return Object.fromEntries(list)
  }

  public getRequestChunk() {
    return this.resumableFile
      .getFile()
      .slice(this.startByte, this.endByte, this.config.setChunkTypeFromFile ? this.resumableFile.getType() : '')
  }

  public handleUploadProgress(evt: ProgressEvent<XMLHttpRequestEventTarget>) {
    const { throttleProgressCallbacks } = this.config
    const newTime = performance.now()

    if (newTime - this.lastProgressCallback > throttleProgressCallbacks) {
      this.resumableFile.handleChunkProgress()
      this.lastProgressCallback = newTime
    }

    this.loaded = evt.loaded || 0
  }

  public getProgress(relativeFile = false) {
    const status = this.getStatus()

    if (status === CHUNK_STATUS.PENDING || this.pendingRetry) {
      return 0
    }

    const factor = relativeFile ? (this.endByte - this.startByte) / this.resumableFile.getSize() : 1

    switch (status) {
      case CHUNK_STATUS.SUCCESS:
      case CHUNK_STATUS.ERROR: {
        return Number(factor)
      }
      default: {
        return (this.loaded / (this.endByte - this.startByte)) * factor
      }
    }
  }

  // OTHER
  private isPermanentError() {
    const { maxChunkRetries } = this.config

    return this.retriesCount >= maxChunkRetries
  }

  private retrySend() {
    const { chunkRetryInterval } = this.config

    this.retriesCount += 1

    if (chunkRetryInterval !== undefined) {
      this.pendingRetry = true
      window.setTimeout(this.send, chunkRetryInterval)
    } else {
      this.send()
    }
  }
}
