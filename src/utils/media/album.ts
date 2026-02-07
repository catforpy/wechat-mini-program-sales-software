/**
 * 相册相关工具函数
 * 提供选择图片、预览图片、保存图片到相册等功能
 */

import { requestCameraPermission, requestPhotoLibraryPermission } from './permission'

/**
 * 选择图片配置
 */
export interface ChooseImageOptions {
  count?: number // 最多选择的图片数量，默认9
  sizeType?: Array<'original' | 'compressed'> // original 原图，compressed 压缩图，默认两者都有
  sourceType?: Array<'album' | 'camera'> // album 从相册选，camera 使用相机，默认两者都有
  extension?: string[] // 文件扩展名，仅 H5 支持
}

/**
 * 选择图片结果
 */
export interface ChooseImageResult {
  tempFilePaths: string[] // 图片本地路径列表
  tempFiles: Array<{
    path: string // 本地路径
    size: number // 本地文件大小，单位 B
  }> // 图片本地文件列表
}

/**
 * 预览图片配置
 */
export interface PreviewImageOptions {
  urls: string[] // 需要预览的图片链接列表
  current?: string // 当前显示图片的链接，默认是 urls 的第一张
  longPressActions?: {
    itemList: string[] // 长按显示的菜单列表
    success?: (res: { tapIndex: number; index: number }) => void
    fail?: () => void
    complete?: () => void
  }
}

/**
 * 保存图片到相册配置
 */
export interface SaveImageOptions {
  filePath: string // 图片文件路径，可以是临时文件路径或永久文件路径
  showLoading?: boolean // 是否显示 loading 提示
}

/**
 * 获取图片信息结果
 */
export interface ImageInfo {
  width: number // 图片宽度，单位 px
  height: number // 图片高度，单位 px
  path: string // 图片本地路径
  orientation: string // 图片旋转方向
  type: string // 图片格式
}

/**
 * 压缩图片配置
 */
export interface CompressImageOptions {
  src: string // 图片路径，图片的路径，可以是相对路径、临时文件路径或存储文件路径
  quality?: number // 压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对 jpg 有效）
  compressedWidth?: number // 压缩后图片的宽度，单位 px
  compressedHeight?: number // 压缩后图片的高度，单位 px
  rotate?: number // 旋转的角度，范围 0～360，默认 0
}

/**
 * 压缩图片结果
 */
export interface CompressImageResult {
  tempFilePath: string // 压缩后的图片路径
  tempFileSize: number // 压缩后的图片大小，单位 B
}

/**
 * 选择图片
 * @param options 选择图片配置
 * @returns 选择结果
 */
export async function chooseImage(options: ChooseImageOptions = {}): Promise<ChooseImageResult> {
  try {
    // 请求相册权限
    const hasPermission = await requestPhotoLibraryPermission()
    if (!hasPermission) {
      throw new Error('没有相册权限')
    }

    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: options.count || 9,
        sizeType: options.sizeType || ['original', 'compressed'],
        sourceType: options.sourceType || ['album', 'camera'],
        extension: options.extension,
        success: (res) => {
          resolve(res as ChooseImageResult)
        },
        fail: (err) => {
          reject(new Error(`选择图片失败: ${JSON.stringify(err)}`))
        }
      })
    })
  } catch (error) {
    console.error('[Album] chooseImage error:', error)
    throw error
  }
}

/**
 * 预览图片
 * @param options 预览配置
 */
export function previewImage(options: PreviewImageOptions): void {
  try {
    uni.previewImage({
      urls: options.urls,
      current: options.current || options.urls[0],
      longPressActions: options.longPressActions
    })
  } catch (error) {
    console.error('[Album] previewImage error:', error)
  }
}

/**
 * 保存图片到系统相册
 * @param options 保存配置
 * @returns 保存结果
 */
export async function saveImageToPhotosAlbum(options: SaveImageOptions): Promise<void> {
  try {
    // 请求写入相册权限
    const hasPermission = await requestPhotoLibraryPermission()
    if (!hasPermission) {
      throw new Error('没有相册写入权限')
    }

    if (options.showLoading !== false) {
      uni.showLoading({ title: '保存中...' })
    }

    return new Promise((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath: options.filePath,
        success: () => {
          if (options.showLoading !== false) {
            uni.hideLoading()
          }
          uni.showToast({ title: '保存成功', icon: 'success' })
          resolve()
        },
        fail: (err) => {
          if (options.showLoading !== false) {
            uni.hideLoading()
          }

          // 用户取消保存
          if ((err as any).errMsg?.includes('cancel')) {
            reject(new Error('用户取消保存'))
          } else {
            reject(new Error(`保存失败: ${JSON.stringify(err)}`))
          }
        }
      })
    })
  } catch (error) {
    console.error('[Album] saveImageToPhotosAlbum error:', error)
    if (options.showLoading !== false) {
      uni.hideLoading()
    }
    throw error
  }
}

/**
 * 获取图片信息
 * @param src 图片路径
 * @returns 图片信息
 */
export function getImageInfo(src: string): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        resolve(res as ImageInfo)
      },
      fail: (err) => {
        reject(new Error(`获取图片信息失败: ${JSON.stringify(err)}`))
      }
    })
  })
}

/**
 * 压缩图片
 * @param options 压缩配置
 * @returns 压缩结果
 */
export function compressImage(options: CompressImageOptions): Promise<CompressImageResult> {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      src: options.src,
      quality: options.quality || 80,
      compressedWidth: options.compressedWidth,
      compressedHeight: options.compressedHeight,
      rotate: options.rotate || 0,
      success: (res) => {
        resolve(res as CompressImageResult)
      },
      fail: (err) => {
        reject(new Error(`压缩图片失败: ${JSON.stringify(err)}`))
      }
    })
  })
}

/**
 * 批量选择图片
 * @param count 最大数量
 * @returns 图片路径列表
 */
export async function chooseMultipleImages(count = 9): Promise<string[]> {
  const result = await chooseImage({
    count,
    sizeType: ['compressed'],
    sourceType: ['album']
  })
  return result.tempFilePaths
}

/**
 * 选择单张图片
 * @returns 图片路径
 */
export async function chooseSingleImage(): Promise<string> {
  const images = await chooseMultipleImages(1)
  return images[0] || ''
}

/**
 * 获取图片尺寸
 * @param src 图片路径
 * @returns 图片宽高
 */
export async function getImageSize(src: string): Promise<{ width: number; height: number }> {
  const info = await getImageInfo(src)
  return {
    width: info.width,
    height: info.height
  }
}

/**
 * 检查是否为图片文件
 * @param filePath 文件路径
 * @returns 是否为图片
 */
export function isImageFile(filePath: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
  const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase()
  return imageExtensions.includes(ext)
}
