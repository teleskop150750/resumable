import type { ResumableFile } from '.'
import type { FileWithPath } from './types'

export interface ResumableEvents {
  /**
   * Добавлен новый файл
   */
  fileAdded: (file: ResumableFile, event: Event) => void
  /**
   * Были добавлены новые файлы (и, возможно, некоторые из них были пропущены).
   */
  filesAdded: (newFiles: ResumableFile[], skippedFiles: FileWithPath[]) => void
  /**
   * Был завершен определенный файл
   * response - ответ сервера
   */
  fileSuccess: (file: ResumableFile, response: unknown) => void
  /**
   * Выполняется загрузка определенного файла
   * response - ответ сервера
   */
  fileProgress: (file: ResumableFile, response: unknown) => void
  /**
   * Что-то пошло не так во время загрузки определенного файла, загрузка повторяется
   */
  fileRetry: (file: ResumableFile) => void
  /**
   * Произошла ошибка при загрузке определенного файла
   * response - ответ сервера
   */
  fileError: (file: ResumableFile, response: unknown) => void
  /**
   * Загрузка запущена для объекта Resumable
   */
  uploadStart: () => void
  /**
   * Загрузка завершена
   */
  complete: () => void
  /**
   * Прогресс загрузки
   */
  progress: (message: string) => void
  /**
   * Загрузка приостановлена
   */
  pause: () => void

  /**
   * Событие перед добавлением файлов
   */
  beforeAdd: () => void
  /**
   * Триггеры перед отменой загрузки.
   */
  beforeCancel: () => void
  /**
   * Загрузка отменена
   */
  cancel: () => void
  /**
   * Произошла ошибка, в том числе fileError
   */
  error: (file: File, message: string) => void

  /**
   * Начата подготовка файла к загрузке
   */
  chunkingStart: (file: ResumableFile) => void
  /**
   * Отображение хода подготовки файлов
   */
  chunkingProgress: (file: ResumableFile, doneOffset: number) => void
  /**
   * Файл готов к загрузке
   */
  chunkingComplete: (file: ResumableFile) => void
}
