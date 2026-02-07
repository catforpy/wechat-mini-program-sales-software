/**
 * 文件选择相关工具函数
 * 提供选择文档、上传文件等功能
 */

/**
 * 文件类型枚举
 */
export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ALL = 'all'
}

/**
 * 选择文件配置
 */
export interface ChooseFileOptions {
  count?: number // 最多选择文件数量，默认100
  extension?: string[] // 文件扩展名过滤
  type?: FileType[] // 文件类型过滤
  sizeType?: Array<'original' | 'compressed'> // 图像压缩类型
}

/**
 * 文件信息
 */
export interface FileInfo {
  name: string // 文件名
  size: number // 文件大小，单位 B
  path: string // 文件本地路径
  type: string // 文件类型
  lastModified: number // 最后修改时间
}

/**
 * 选择文件结果
 */
export interface ChooseFileResult {
  files: FileInfo[] // 文件列表
}

/**
 * 上传文件配置
 */
export interface UploadFileOptions {
  url: string // 服务器接口地址
  filePath: string // 要上传的文件路径
  name: string // 文件对应的 key
  formData?: Record<string, any> // HTTP 请求中的其他表单数据
  header?: Record<string, string> // HTTP 请求 Header
  timeout?: number // 超时时间，单位 ms
}

/**
 * 上传文件结果
 */
export interface UploadFileResult {
  data: string // 服务器返回的数据
  statusCode: number // 服务器返回的 HTTP 状态码
}

/**
 * 下载文件配置
 */
export interface DownloadFileOptions {
  url: string // 下载资源的 url
  header?: Record<string, string> // HTTP 请求 Header
  timeout?: number // 超时时间，单位 ms
}

/**
 * 下载文件结果
 */
export interface DownloadFileResult {
  tempFilePath: string // 本地临时文件路径
  statusCode: number // 服务器返回的 HTTP 状态码
}

/**
 * 文件保存配置
 */
export interface SaveFileOptions {
  tempFilePath: string // 临时文件路径
}

/**
 * 文件保存结果
 */
export interface SaveFileResult {
  savedFilePath: string // 存储后的文件路径
}

/**
 * 文件信息结果
 */
export interface FileStatResult {
  size: number // 文件大小，单位 B
  createTime: number // 创建时间
}

/**
 * 选择文件
 * @param options 选择配置
 * @returns 选择结果
 */
export async function chooseFile(options: ChooseFileOptions = {}): Promise<ChooseFileResult> {
  try {
    return new Promise((resolve, reject) => {
      // H5 环境
      // #ifdef H5
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = (options.count || 1) > 1
      input.accept = options.extension?.join(',') || '*'

      input.onchange = (e: any) => {
        const files = Array.from(e.target.files)
        const fileInfos: FileInfo[] = files.map((file: any) => ({
          name: file.name,
          size: file.size,
          path: URL.createObjectURL(file),
          type: file.type,
          lastModified: file.lastModified
        }))

        resolve({ files: fileInfos })
      }

      input.oncancel = () => {
        reject(new Error('用户取消选择'))
      }

      input.click()
      // #endif

      // 小程序环境
      // #ifndef H5
      // 小程序环境使用 uni.chooseMessageFile
      uni.chooseMessageFile({
        count: options.count || 100,
        type: 'file',
        extension: options.extension,
        success: (res: any) => {
          const files = res.fileList.map((file: any) => ({
            name: file.name,
            size: file.size,
            path: file.path,
            type: file.type,
            lastModified: Date.now()
          }))

          resolve({ files })
        },
        fail: (err) => {
          if ((err as any).errMsg?.includes('cancel')) {
            reject(new Error('用户取消选择'))
          } else {
            reject(new Error(`选择文件失败: ${JSON.stringify(err)}`))
          }
        }
      })
      // #endif
    })
  } catch (error) {
    console.error('[File] chooseFile error:', error)
    throw error
  }
}

/**
 * 选择单个文件
 * @param extension 文件扩展名
 * @returns 文件信息
 */
export async function chooseSingleFile(extension?: string[]): Promise<FileInfo> {
  const result = await chooseFile({
    count: 1,
    extension
  })
  return result.files[0]
}

/**
 * 上传文件
 * @param options 上传配置
 * @returns 上传结果
 */
export async function uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
  try {
    uni.showLoading({ title: '上传中...' })

    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: options.url,
        filePath: options.filePath,
        name: options.name || 'file',
        formData: options.formData,
        header: options.header,
        timeout: options.timeout || 60000,
        success: (res: any) => {
          uni.hideLoading()
          if (res.statusCode === 200) {
            uni.showToast({ title: '上传成功', icon: 'success' })
            resolve({
              data: res.data,
              statusCode: res.statusCode
            })
          } else {
            reject(new Error(`上传失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          uni.hideLoading()
          reject(new Error(`上传失败: ${JSON.stringify(err)}`))
        }
      })

      // 监听上传进度
      uploadTask.onProgressUpdate((res) => {
        console.log(`[File] 上传进度: ${res.progress}%`)
      })
    })
  } catch (error) {
    console.error('[File] uploadFile error:', error)
    uni.hideLoading()
    throw error
  }
}

/**
 * 下载文件
 * @param options 下载配置
 * @returns 下载结果
 */
export async function downloadFile(options: DownloadFileOptions): Promise<DownloadFileResult> {
  try {
    uni.showLoading({ title: '下载中...' })

    return new Promise((resolve, reject) => {
      const downloadTask = uni.downloadFile({
        url: options.url,
        header: options.header,
        timeout: options.timeout || 60000,
        success: (res: any) => {
          uni.hideLoading()
          if (res.statusCode === 200) {
            uni.showToast({ title: '下载成功', icon: 'success' })
            resolve({
              tempFilePath: res.tempFilePath,
              statusCode: res.statusCode
            })
          } else {
            reject(new Error(`下载失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          uni.hideLoading()
          reject(new Error(`下载失败: ${JSON.stringify(err)}`))
        }
      })

      // 监听下载进度
      downloadTask.onProgressUpdate((res) => {
        console.log(`[File] 下载进度: ${res.progress}%`)
      })
    })
  } catch (error) {
    console.error('[File] downloadFile error:', error)
    uni.hideLoading()
    throw error
  }
}

/**
 * 保存文件到本地
 * @param options 保存配置
 * @returns 保存结果
 */
export async function saveFile(options: SaveFileOptions): Promise<SaveFileResult> {
  try {
    return new Promise((resolve, reject) => {
      uni.saveFile({
        tempFilePath: options.tempFilePath,
        success: (res: any) => {
          resolve({
            savedFilePath: res.savedFilePath
          })
        },
        fail: (err) => {
          reject(new Error(`保存文件失败: ${JSON.stringify(err)}`))
        }
      })
    })
  } catch (error) {
    console.error('[File] saveFile error:', error)
    throw error
  }
}

/**
 * 获取文件信息
 * @param filePath 文件路径
 * @returns 文件信息
 */
export function getFileInfo(filePath: string): Promise<FileStatResult> {
  return new Promise((resolve, reject) => {
    uni.getFileInfo({
      filePath,
      success: (res: any) => {
        resolve({
          size: res.size,
          createTime: Date.now()
        })
      },
      fail: (err) => {
        reject(new Error(`获取文件信息失败: ${JSON.stringify(err)}`))
      }
    })
  })
}

/**
 * 删除本地文件
 * @param filePath 文件路径
 * @returns 删除结果
 */
export function removeFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // #ifndef H5
    uni.removeSavedFile({
      filePath,
      success: () => {
        resolve()
      },
      fail: (err) => {
        reject(new Error(`删除文件失败: ${JSON.stringify(err)}`))
      }
    })
    // #endif

    // #ifdef H5
    // H5 环境暂不支持删除本地文件
    reject(new Error('H5 环境不支持删除文件'))
    // #endif
  })
}

/**
 * 打开文档
 * @param filePath 文件路径
 * @param fileType 文件类型
 */
export function openDocument(filePath: string, fileType?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.openDocument({
      filePath,
      fileType,
      success: () => {
        resolve()
      },
      fail: (err) => {
        reject(new Error(`打开文档失败: ${JSON.stringify(err)}`))
      }
    })
  })
}

/**
 * 格式化文件大小
 * @param size 文件大小（字节）
 * @returns 格式化后的字符串
 */
export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
}

/**
 * 获取文件扩展名
 * @param fileName 文件名
 * @returns 扩展名
 */
export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return ''
  }
  return fileName.substring(lastDotIndex + 1).toLowerCase()
}

/**
 * 判断是否为图片文件
 * @param fileName 文件名
 * @returns 是否为图片
 */
export function isImageFile(fileName: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const ext = getFileExtension(fileName)
  return imageExtensions.includes(ext)
}

/**
 * 判断是否为视频文件
 * @param fileName 文件名
 * @returns 是否为视频
 */
export function isVideoFile(fileName: string): boolean {
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv']
  const ext = getFileExtension(fileName)
  return videoExtensions.includes(ext)
}

/**
 * 判断是否为音频文件
 * @param fileName 文件名
 * @returns 是否为音频
 */
export function isAudioFile(fileName: string): boolean {
  const audioExtensions = ['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg']
  const ext = getFileExtension(fileName)
  return audioExtensions.includes(ext)
}

/**
 * 判断是否为文档文件
 * @param fileName 文件名
 * @returns 是否为文档
 */
export function isDocumentFile(fileName: string): boolean {
  const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
  const ext = getFileExtension(fileName)
  return docExtensions.includes(ext)
}

/**
 * 根据文件类型获取 MIME 类型
 * @param fileName 文件名
 * @returns MIME 类型
 */
export function getMimeType(fileName: string): string {
  const ext = getFileExtension(fileName)

  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain'
  }

  return mimeTypes[ext] || 'application/octet-stream'
}
