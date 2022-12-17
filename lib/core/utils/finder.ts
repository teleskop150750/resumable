import type { FileWithPath } from '../types'

/**
 * cps-style стиль непрерывной передачи.
 * вызывает все функции в списке и ожидает запуска их callback.
 * @param items список функций, ожидающих параметра обратного вызова
 * @param cb    обратный вызов для запуска после того, как был вызван последний обратный вызов
 */
export const findFiles = (items: Array<(cb: () => void) => void>, cb: () => void) => {
  if (!items || items.length === 0) {
    return cb()
  }

  // вызовите текущую функцию, передайте следующую часть в качестве продолжения
  items[0](() => {
    findFiles(items.slice(1), cb)
  })
}

/**
 * рекурсивно просматривайте каталог и собирайте файлы для загрузки
 * @param directory каталог для обработки
 * @param path      текущий путь
 * @param items     целевой список элементов
 * @param cb        callback вызываемый после обхода каталога
 */
const processDirectory = (directory: FileSystemDirectoryEntry, path: string, items: FileWithPath[], cb: () => void) => {
  const dirReader = directory.createReader()

  dirReader.readEntries((entries) => {
    if (entries.length === 0) {
      return cb()
    }

    findFiles(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      entries.map((entry) => processItem.bind(null, entry, path, items)),
      cb,
    )
  })
}

/**
 * обрабатывает один загружаемый элемент (файл или каталог)
 * @param item элемент для загрузки, может быть файлом или записью в каталоге
 * @param path текущий путь к файлу
 * @param items список файлов для добавления новых элементов
 * @param cb callback вызывается при обработке элемента
 */
export const processItem = (
  item: File | FileSystemEntry | DataTransferItem,
  path: string,
  items: FileWithPath[],
  cb: () => void,
) => {
  if (item instanceof File) {
    items.push({ file: item, relativePath: '' })
    cb()

    return
  }

  if ('isFile' in item && item.isFile) {
    // предоставленный файл
    ;(item as FileSystemFileEntry).file((file) => {
      items.push({ file, relativePath: path + file.name })
      cb()
    })

    return
  }

  let entry = undefined

  if ('isDirectory' in item && item.isDirectory) {
    // элемент уже является записью каталога, просто назначьте
    entry = item as FileSystemDirectoryEntry
  }

  if ('webkitGetAsEntry' in item) {
    entry = item.webkitGetAsEntry()
  }

  if (entry && entry.isDirectory) {
    processDirectory(entry as FileSystemDirectoryEntry, `${path + entry.name}/`, items, cb)

    return
  }

  if ('getAsFile' in item) {
    // элемент представляет собой файловый объект, преобразуйте его
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    item = item.getAsFile()!

    if (item instanceof File) {
      items.push({
        file: item,
        relativePath: path + item.name,
      })
    }
  }

  cb()
}
