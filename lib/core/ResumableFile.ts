import type { ResumableConfig } from './config'
import { CHUNK_STATUS } from './constants'
import type { Resumable } from './Resumable'
import { ResumableChunk } from './ResumableChunk'
import type { FileWithPath, Nillable } from './types'

export class ResumableFile {
  private readonly uniqId: string

  private file: File

  private path: string

  private prevProgress = 0

  private chunks: ResumableChunk[] = []

  private pause = false

  private error = false

  private config: ResumableConfig

  private resumable: Resumable

  private response: Nillable<unknown> = undefined

  public constructor(resumable: Resumable, fileWithPath: FileWithPath, uniqId: string) {
    this.uniqId = uniqId
    this.file = fileWithPath.file
    this.path = fileWithPath.relativePath || fileWithPath.file.webkitRelativePath || fileWithPath.file.name
    this.resumable = resumable
    this.config = resumable.getConfig()
    this.resumable.emit('chunkingStart', this)
    this.bootstrap()
  }

  // FIELDS
  public getResumable() {
    return this.resumable
  }

  public getUniqueId() {
    return this.uniqId
  }

  public getFile() {
    return this.file
  }

  public getName() {
    return this.file.name
  }

  public getPath() {
    return this.path
  }

  public getSize() {
    return this.file.size
  }

  public getType() {
    return this.file.type
  }

  public getChunks() {
    return this.chunks
  }

  public isUploading() {
    for (const chunk of this.chunks) {
      if (chunk.getStatus() === CHUNK_STATUS.UPLOADING) {
        return true
      }
    }

    return false
  }

  public isComplete() {
    let outstanding = false

    for (const chunk of this.chunks) {
      const status = chunk.getStatus()

      if (status === CHUNK_STATUS.PENDING || status === CHUNK_STATUS.UPLOADING) {
        outstanding = true

        break
      }
    }

    return !outstanding
  }

  public isPause() {
    return this.pause
  }

  public setPause(val = true) {
    this.pause = val
  }

  public isError() {
    return this.error
  }

  public setError(val = true) {
    this.error = val
  }

  public setResponse(val: Nillable<unknown> = undefined) {
    this.response = val
  }

  public getResponse(): Nillable<unknown> {
    return this.response
  }

  // METHODS
  public abort() {
    // ???????????????????? ?????????????? ????????????????
    let abortCount = 0

    this.chunks.forEach((chunk) => {
      if (chunk.getStatus() === CHUNK_STATUS.UPLOADING) {
        chunk.abort()
        abortCount += 1
      }
    })

    if (abortCount > 0) {
      this.resumable.emit('fileProgress', this, undefined)
    }
  }

  public cancel() {
    // ???????????????? ???????? ????????, ?????????? ???? ?????? ????????????????????????????????
    const _chunks = this.chunks

    this.chunks = []
    _chunks.forEach((chunk) => {
      if (chunk.getStatus() === CHUNK_STATUS.UPLOADING) {
        chunk.abort()
        this.resumable.uploadNextChunk()
      }
    })
    this.resumable.removeResumableFile(this)
    this.resumable.emit('fileProgress', this, undefined)
  }

  public retry() {
    this.abort()
    this.bootstrap()
    let firedRetry = false

    this.resumable.on('chunkingComplete', () => {
      if (firedRetry) {
        return
      }

      firedRetry = true
      this.resumable.upload()
    })
  }

  public getProgress() {
    if (this.isError()) {
      return 1
    }

    // ?????????????????? ???????? ?????????????????? ???? ????????
    let result = 0

    for (const chunk of this.chunks) {
      if (chunk.getStatus() === CHUNK_STATUS.ERROR) {
        result = 1
        break
      }

      // ???????????????? ???????????????? ?????????????????? ???????????????????????? ?????????? ??????????
      result += chunk.getProgress(true)
    }

    result = result > 0.999_99 ? 1 : result
    // ???? ???? ?????????? ???????????? ???????????????? ?????? ???????????????????????? ????????????????
    result = Math.max(this.prevProgress, result)
    this.prevProgress = result

    return result
  }

  public async bootstrap() {
    this.setError(false)
    this.chunks = []
    this.prevProgress = 0
    const round = this.config.forceChunkSize ? Math.ceil : Math.floor
    const maxOffset = Math.max(round(this.getSize() / this.config.chunkSize), 1)

    for (let offset = 0; offset < maxOffset; offset++) {
      this.chunks.push(new ResumableChunk(this.resumable, this, offset))
      this.resumable.emit('chunkingProgress', this, offset / maxOffset)
    }

    this.resumable.emit('chunkingComplete', this)
  }

  public handleChunkSuccess(response: unknown = undefined) {
    if (this.isError()) {
      return
    }

    this.resumable.emit('fileProgress', this, response)

    if (this.isComplete()) {
      this.resumable.emit('fileSuccess', this, response)
    }
  }

  public handleChunkError(response: unknown = undefined) {
    this.abort()
    this.setError()
    this.chunks = []
    this.resumable.emit('fileError', this, response)
  }

  public handleChunkProgress(response: unknown = undefined) {
    this.resumable.emit('fileProgress', this, response)
  }

  public handleChunkRetry() {
    this.resumable.emit('fileRetry', this)
  }
}
