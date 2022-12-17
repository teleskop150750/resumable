import type { ResumableChunk } from './ResumableChunk'
import type { FileWithPath, Nillable } from './types'

export interface ResumableConfig {
  /**
   * Обработчик загрузки чанка
   */
  handleSendChunk?: (chunk: ResumableChunk) => void
  /**
   * Обработчик проверки существования чанка
   */
  handleTestChunk?: (chunk: ResumableChunk) => void
  /**
   * Расставьте приоритеты для первого и последнего фрагментов всех файлов.
   * Это может быть удобно, если вы можете определить,
   * действителен ли файл для вашей службы только из первого или последнего фрагмента.
   * Например, метаданные фото или видео обычно находятся в первой части файла,
   * что упрощает тестирование поддержки только первого chunk.
   * (По умолчанию: false)
   */
  prioritizeFirstAndLastChunk: false
  /**
   * Размер каждого загруженного фрагмента данных в байтах.
   * Если `forceChunkSize = false`, последний загруженный чана будет
   * как минимум такого размера или не более чем в два раза больше.
   * (По умолчанию: 1*1024*1024 )
   */
  chunkSize: number
  /**
   * Минимальный допустимый размер файла.
   * (По умолчанию: undefined)
   */
  minFileSize: Nillable<number>
  /**
   * Максимально допустимый размер файла.
   * (По умолчанию: undefined)
   */
  maxFileSize: Nillable<number>
  /**
   * Заставьте все chunks быть меньше или равны размеру chunkSize.
   * В противном случае последний кусок будет больше или равен.
   * (По умолчанию: true)
   */
  forceChunkSize: boolean
  /**
   * Количество одновременных загрузок (по умолчанию: 3)
   */
  simultaneousUploads: number
  /**
   * Сделайте запрос GET к серверу для каждого chunk, чтобы узнать, существует ли он уже.
   * Если это реализовано на стороне сервера, это позволит загружать резюме даже после сбоя браузера или
   * даже перезагрузки компьютера. (По умолчанию: true)
   */
  testChunks: boolean
  /**
   * Указывает, сколько файлов может быть загружено за один сеанс.
   * Допустимыми значениями являются любое положительное целое число и, следовательно, без ограничений.
   * (По умолчанию: undefined)
   */
  maxFiles: Nillable<number>
  /**
   * Имя индекса блока (base-1) в текущем параметре POST загрузки, который будет использоваться для блока файла
   * (по умолчанию: resumableChunkNumber)
   */
  chunkNumberParameterName: string
  /**
   * Имя параметра POST общего числа блоков, используемых для блока файла
   * (по умолчанию: resumableTotalChunks)
   */
  totalChunksParameterName: string
  /**
   * Имя параметра POST общего размера блока, используемого для блока файлов
   * (по умолчанию: resumableChunkSize)
   */
  chunkSizeParameterName: string
  /**
   * Имя параметра POST общего размера файла, используемого для блока файла
   * (по умолчанию: resumableTotalSize)
   */
  totalSizeParameterName: string
  /**
   * Имя параметра POST уникального идентификатора, используемого для фрагмента файла
   * (по умолчанию: resumableId)
   */
  identifierParameterName: string
  /**
   * Имя исходного параметра POST с именем файла, используемого для фрагмента файла
   * (по умолчанию: resumableFileName)
   */
  fileNameParameterName: string
  /**
   * Имя параметра POST относительного пути к файлу, используемого для фрагмента файла
   * (по умолчанию: resumableRelativePath)
   */
  relativePathParameterName: string
  /**
   * Имя параметра POST текущего размера блока, используемого для блока файла
   * (по умолчанию: resumableCurrentChunkSize)
   */
  currentChunkSizeParameterName: string
  /**
   * Имя параметра POST типа файла, используемого для фрагмента файла
   * (по умолчанию: resumableType)
   */
  typeParameterName: string
  /**
   * Дополнительный префикс добавляется перед именем каждого параметра
   * (по умолчанию: '')
   */
  parameterPrefix: string
  /**
   * Задержка перед обновлением прогресса
   * (по умолчанию: 1)
   */
  throttleProgressCallbacks: number
  /**
   * Максимальное количество попыток для чанка до того, как загрузка не удастся.
   * Допустимыми значениями являются любые положительные целые числа и undefined без ограничений.
   * (по умолчанию: 2)
   */
  maxChunkRetries: number
  /**
   * Количество миллисекунд ожидания перед повторной попыткой выполнения фрагмента в случае непостоянной ошибки.
   * Допустимыми значениями являются любые положительные целые числа и undefined немедленная повторная попытка.
   * (по умолчанию: undefined)
   */
  chunkRetryInterval: Nillable<number>
  /**
   * Очищать input при добавлении
   * (по умолчанию: true)
   */
  clearInput: boolean
  /**
   * Задайте тип содержимого блока из исходного файла file.type.
   * (По умолчанию: false)
   */
  setChunkTypeFromFile: boolean
  /**
   * Типы файлов, разрешенные для загрузки. Пустой массив допускает любой тип файла.
   * (По умолчанию: [])
   */
  fileTypes: Array<string>
  generateUniqId: (fileWithPath: FileWithPath, event: Event) => string | Promise<string>
  maxFilesErrorCallback: (files: FileWithPath[], maxFiles: number) => void
  minFileSizeErrorCallback: (file: File, minFileSize: number) => void
  maxFileSizeErrorCallback: (file: File, maxFileSize: number) => void
  fileTypeErrorCallback: (file: File, fileTypes: Array<string>) => void
}

export type ClientResumableConfig = Partial<ResumableConfig>

export const resumableConfig: ResumableConfig = {
  prioritizeFirstAndLastChunk: false,
  chunkSize: 1 * 1024 * 1024,
  simultaneousUploads: 3,
  testChunks: true,
  maxFiles: undefined as Nillable<number>,
  forceChunkSize: true,
  chunkNumberParameterName: 'resumableChunkNumber',
  chunkSizeParameterName: 'resumableChunkSize',
  currentChunkSizeParameterName: 'resumableCurrentChunkSize',
  totalSizeParameterName: 'resumableTotalSize',
  typeParameterName: 'resumableType',
  identifierParameterName: 'resumableId',
  fileNameParameterName: 'resumableFileName',
  relativePathParameterName: 'resumableRelativePath',
  totalChunksParameterName: 'resumableTotalChunks',
  throttleProgressCallbacks: 1,
  parameterPrefix: '',
  maxChunkRetries: 2,
  chunkRetryInterval: undefined,
  clearInput: true,
  setChunkTypeFromFile: false,
  minFileSize: undefined as Nillable<number>,
  maxFileSize: undefined as Nillable<number>,
  fileTypes: [] as Array<string>,

  generateUniqId(fileWithPath) {
    const relativePath = fileWithPath.relativePath || fileWithPath.file.webkitRelativePath || ''

    return `${fileWithPath.file.name}-${relativePath.replaceAll(/[^\w-]/gim, '')}-${fileWithPath.file.size}-${
      fileWithPath.file.lastModified
    }`
  },
  maxFilesErrorCallback(_, maxFiles: number) {
    console.error(`Please upload no more than ${maxFiles} file${maxFiles === 1 ? '' : 's'} at a time.`)
  },
  minFileSizeErrorCallback(file: File, minFileSize: number) {
    console.error(`${file.name} is too small, please upload files larger than ${minFileSize}.`)
  },
  maxFileSizeErrorCallback(file: File, maxFileSize: number) {
    console.error(`${file.name} is too large, please upload files less than ${maxFileSize}.`)
  },
  fileTypeErrorCallback(file: File, fileTypes: typeof this.fileTypes) {
    console.error(`${file.name} has type not allowed, please upload files of type ${fileTypes}.`)
  },
}
