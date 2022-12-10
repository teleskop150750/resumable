import axios, { AxiosError, CanceledError } from 'axios'
import { Md5 } from 'ts-md5'

import { type ResumableChunk, Resumable } from '../../lib'
import { configureDrop, hide, show } from './helpers'

const targetSend = document.querySelector('.target--send .target__input') as HTMLButtonElement
const targetTest = document.querySelector('.target--test .target__input') as HTMLButtonElement
const token = document.querySelector('.token .token__input') as HTMLButtonElement
const drop = document.querySelector('.drop') as HTMLDivElement
const progress = document.querySelector('.progress') as HTMLDivElement
const progressBar = document.querySelector('.progress__bar') as HTMLDivElement
const list = document.querySelector('.resumable-list') as HTMLDivElement

const buttonAdd = document.querySelector('.button-add') as HTMLButtonElement
const buttonUpload = document.querySelector('.button-upload') as HTMLButtonElement
const buttonResume = document.querySelector('.progress-button--resume') as HTMLButtonElement
const buttonPause = document.querySelector('.progress-button--pause') as HTMLButtonElement
const buttonCancel = document.querySelector('.progress-button--cancel') as HTMLButtonElement

const input = document.querySelector('.input') as HTMLInputElement

buttonAdd.addEventListener('click', () => {
  input.click()
})

configureDrop(drop)

// config
const handleSendChunk = async (chunk: ResumableChunk) => {
  const data = chunk.getRequestChunk()
  const params = chunk.getRequestParams()
  const formData = new FormData()

  formData.append('file', data, chunk.getResumableFile().getName())
  try {
    const response = await axios.postForm(targetSend.value.trim(), formData, {
      params,
      signal: chunk.getController()?.signal,
      onUploadProgress: (evt) => chunk.handleUploadProgress(evt.event),
      headers: {
        Authorization: `Bearer ${token.value.trim()}`,
      },
    })

    chunk.doneSend(true, response.data)
  } catch (error) {
    if (error instanceof CanceledError) {
      chunk.doneAbort()

      return
    }

    if (error instanceof AxiosError) {
      chunk.doneSend(false, true, error.response?.data)

      return
    }

    chunk.doneSend(false, true)
  }
}

const handleTestChunk = async (chunk: ResumableChunk) => {
  const params = chunk.getRequestParams()

  try {
    const response = await axios.get(targetTest.value.trim(), {
      params,
      signal: chunk.getController()?.signal,
      headers: {
        Authorization: `Bearer ${token.value.trim()}`,
      },
    })

    chunk.doneTest(true, response)
  } catch (error) {
    if (error instanceof CanceledError) {
      chunk.doneAbort()

      return
    }

    if (error instanceof AxiosError) {
      chunk.doneTest(false, error.response?.data)

      return
    }

    chunk.doneTest(false)
  }
}

const resumable = new Resumable({
  chunkSize: 1 * 1024 * 1024,
  simultaneousUploads: 1,
  handleSendChunk,
  handleTestChunk,
  testChunks: false,
  generateUniqId(fileWithPath) {
    const relativePath = fileWithPath.relativePath || fileWithPath.file.webkitRelativePath || fileWithPath.file.name

    return Md5.hashStr(
      `${relativePath.replace(/[^\w-]/gim, '')}-${fileWithPath.file.size}-${fileWithPath.file.lastModified}`,
    )
  },
})

input.addEventListener('change', (evt) => {
  resumable.handleInputChange(evt)
})

buttonUpload.addEventListener('click', () => {
  resumable.upload()
})

buttonResume.addEventListener('click', () => {
  resumable.upload()
})

buttonPause.addEventListener('click', () => {
  resumable.pause()
})

buttonCancel.addEventListener('click', () => {
  resumable.cancel()
})

drop.addEventListener('drop', (evt) => {
  drop.classList.remove('drop--dragover')
  resumable.handleDrop(evt)
})

// handlers
resumable.on('fileAdded', (resumableFile) => {
  // Show progress pabr
  show(progress)
  show(list)

  // Show pause, hide resume
  hide(buttonResume)
  show(buttonCancel)

  const item = document.createElement('div')

  item.classList.add('resumable-file')
  item.classList.add(`resumable-file-${resumableFile.getUniqueId()}`)
  const itemName = document.createElement('span')

  itemName.classList.add('resumable-file-name')
  itemName.textContent = resumableFile.getName()

  const itemProgress = document.createElement('span')

  itemProgress.classList.add('resumable-file-progress')
  item.append(itemName)
  item.append(itemProgress)
  list.append(item)
})

resumable.on('pause', () => {
  // Show resume, hide pause
  show(buttonResume)
  hide(buttonPause)
})

resumable.on('complete', () => {
  // Hide pause/resume when the upload has completed
  hide(buttonResume)
  hide(buttonPause)
  hide(buttonCancel)
})

resumable.on('fileSuccess', (file) => {
  // Reflect that the file upload has completed
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const el = document.querySelector(`.resumable-file-${file.getUniqueId()} .resumable-file-progress`)!

  el.textContent = '(completed)'
})

resumable.on('fileError', (file, message) => {
  // Reflect that the file upload has resulted in error
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const el = document.querySelector(`.resumable-file-${file.getUniqueId()} .resumable-file-progress`)!

  el.textContent = `(file could not be uploaded: ${message})`
})

resumable.on('fileProgress', (file) => {
  // Handle progress for both the file and the overall upload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const el = document.querySelector(`.resumable-file-${file.getUniqueId()} .resumable-file-progress`)!

  el.textContent = `${Math.floor(file.getProgress() * 100)}%`
  progressBar.style.cssText = `width:${Math.floor(resumable.getProgress() * 100)}%;`
})

resumable.on('cancel', () => {
  const fileProgresses = document.querySelectorAll('.resumable-file-progress')

  for (const fileProgress of fileProgresses) {
    if (!fileProgress.classList.contains('ready')) {
      fileProgress.textContent = '(canceled)'
    }
  }
})

resumable.on('uploadStart', () => {
  // Show pause, hide resume
  hide(buttonResume)
  show(buttonPause)
})
