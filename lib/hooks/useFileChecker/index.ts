import type { ResumableConfig } from '../../config/resumableConfig'

export const checkFile = (file: File, options: ResumableConfig) => {
  if (!checkFileType(file, options.fileTypes)) {
    options.fileTypeErrorCallback(file, options.fileTypes)

    return false
  }

  if (!checkMinSize(file, options.minFileSize)) {
    options.minFileSizeErrorCallback(file, options.minFileSize as number)

    return false
  }

  if (!checkMaxSize(file, options.maxChunkRetries)) {
    options.maxFileSizeErrorCallback(file, options.maxChunkRetries)

    return false
  }

  return true
}

export function checkFileType(file: File, fileTypes: ResumableConfig['fileTypes']) {
  const fileName = file.name

  if (!fileTypes) {
    return true
  }

  const extensions = fileTypes.map((fileType) => `.${fileType}`)
  const fileNameUpper = fileName.toUpperCase()

  return extensions.some((extension) => extension.toLowerCase() === fileNameUpper.slice(extension.length)) !== undefined
}

export function checkMinSize(file: File, minFileSize: ResumableConfig['minFileSize']) {
  if (minFileSize === undefined) {
    return true
  }

  if (file.size >= minFileSize) {
    return false
  }

  return true
}

export function checkMaxSize(file: File, maxFileSize: ResumableConfig['maxFileSize']) {
  if (maxFileSize === undefined) {
    return true
  }

  if (file.size < maxFileSize) {
    return false
  }

  return true
}
