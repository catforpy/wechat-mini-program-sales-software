/**
 * 相机相关工具函数
 * 提供拍照、录制视频等功能
 */

import { requestCameraPermission, requestMicrophonePermission } from './permission'

/**
 * 拍照配置
 */
export interface ChooseImageOptions {
  quality?: 'high' | 'normal' | 'low' // 图片质量，默认 high
  success?: (res: { tempFilePath: string; tempThumbPath?: string }) => void
  fail?: () => void
  complete?: () => void
}

/**
 * 拍照结果
 */
export interface CameraImageResult {
  tempFilePath: string // 图片本地路径
  width?: number // 图片宽度
  height?: number // 图片高度
}

/**
 * 录制视频配置
 */
export interface RecordVideoOptions {
  camera?: 'front' | 'back' // 前置或后置摄像头，默认 back
  maxDuration?: number // 最长录制时长，单位秒，默认60
  quality?: 'high' | 'medium' | 'low' // 视频质量，默认 high
  sourceType?: 'album' | 'camera' // album 从相册选择，camera 使用相机拍摄
}

/**
 * 录制视频结果
 */
export interface RecordVideoResult {
  tempFilePath: string // 视频本地路径
  duration: number // 视频时长，单位秒
  size: number // 视频文件大小，单位 B
  height: number // 视频高度
  width: number // 视频宽度
  thumbTempFilePath: string // 视频缩略图本地路径
}

/**
 * 相机配置
 */
export interface CameraOptions {
  resolution?: 'low' | 'medium' | 'high' // 拍照分辨率，默认 high
  flashMode?: 'auto' | 'on' | 'off' // 闪光灯模式
}

/**
 * 拍照
 * @param options 拍照配置
 * @returns 拍照结果
 */
export async function takePhoto(options: CameraOptions = {}): Promise<CameraImageResult> {
  try {
    // 请求相机权限
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      throw new Error('没有相机权限')
    }

    return new Promise((resolve, reject) => {
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['camera'],
        maxDuration: 30,
        camera: 'back',
        success: (res: any) => {
          if (res.tempFiles && res.tempFiles.length > 0) {
            resolve({
              tempFilePath: res.tempFiles[0].tempFilePath,
              width: res.tempFiles[0].width,
              height: res.tempFiles[0].height
            })
          } else {
            reject(new Error('拍照失败'))
          }
        },
        fail: (err) => {
          // 用户取消
          if ((err as any).errMsg?.includes('cancel')) {
            reject(new Error('用户取消拍照'))
          } else {
            reject(new Error(`拍照失败: ${JSON.stringify(err)}`))
          }
        }
      })
    })
  } catch (error) {
    console.error('[Camera] takePhoto error:', error)
    throw error
  }
}

/**
 * 录制视频
 * @param options 录制配置
 * @returns 录制结果
 */
export async function recordVideo(options: RecordVideoOptions = {}): Promise<RecordVideoResult> {
  try {
    // 请求相机和麦克风权限
    const cameraPermission = await requestCameraPermission()
    if (!cameraPermission) {
      throw new Error('没有相机权限')
    }

    const micPermission = await requestMicrophonePermission()
    if (!micPermission) {
      throw new Error('没有麦克风权限')
    }

    return new Promise((resolve, reject) => {
      uni.chooseVideo({
        sourceType: options.sourceType || ['camera'],
        camera: options.camera || 'back',
        maxDuration: options.maxDuration || 60,
        quality: options.quality || 'high',
        success: (res: any) => {
          resolve({
            tempFilePath: res.tempFilePath,
            duration: res.duration,
            size: res.size,
            height: res.height,
            width: res.width,
            thumbTempFilePath: res.thumbTempFilePath
          })
        },
        fail: (err) => {
          // 用户取消
          if ((err as any).errMsg?.includes('cancel')) {
            reject(new Error('用户取消录制'))
          } else {
            reject(new Error(`录制视频失败: ${JSON.stringify(err)}`))
          }
        }
      })
    })
  } catch (error) {
    console.error('[Camera] recordVideo error:', error)
    throw error
  }
}

/**
 * 从相册选择视频
 * @param maxDuration 最长时长
 * @returns 视频信息
 */
export async function chooseVideoFromAlbum(maxDuration = 60): Promise<RecordVideoResult> {
  try {
    return new Promise((resolve, reject) => {
      uni.chooseVideo({
        sourceType: ['album'],
        maxDuration,
        success: (res: any) => {
          resolve({
            tempFilePath: res.tempFilePath,
            duration: res.duration,
            size: res.size,
            height: res.height,
            width: res.width,
            thumbTempFilePath: res.thumbTempFilePath
          })
        },
        fail: (err) => {
          if ((err as any).errMsg?.includes('cancel')) {
            reject(new Error('用户取消选择'))
          } else {
            reject(new Error(`选择视频失败: ${JSON.stringify(err)}`))
          }
        }
      })
    })
  } catch (error) {
    console.error('[Camera] chooseVideoFromAlbum error:', error)
    throw error
  }
}

/**
 * 获取视频信息
 * @param src 视频路径
 * @returns 视频信息
 */
export function getVideoInfo(src: string): Promise<RecordVideoResult> {
  return new Promise((resolve, reject) => {
    uni.getVideoInfo({
      src,
      success: (res: any) => {
        resolve({
          tempFilePath: src,
          duration: res.duration,
          size: res.size,
          height: res.height,
          width: res.width,
          thumbTempFilePath: res.thumbTempFilePath
        })
      },
      fail: (err) => {
        reject(new Error(`获取视频信息失败: ${JSON.stringify(err)}`))
      }
    })
  })
}

/**
 * 截取视频画面
 * @param src 视频路径
 * @param time 截取时间点，单位秒
 * @returns 图片路径
 */
export function takeVideoSnapshot(src: string, time = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.createVideoContext('video').snapshot({
      time,
      success: (res: any) => {
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        reject(new Error(`截取视频画面失败: ${JSON.stringify(err)}`))
      }
    })
  })
}

/**
 * 压缩视频
 * @param src 视频路径
 * @param quality 压缩质量
 * @returns 压缩后的视频路径
 */
export function compressVideo(src: string, quality = 'medium'): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.compressVideo({
      src,
      quality,
      success: (res: any) => {
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        reject(new Error(`压缩视频失败: ${JSON.stringify(err)}`))
      }
    })
  })
}

/**
 * 保存视频到相册
 * @param filePath 视频文件路径
 * @returns 保存结果
 */
export async function saveVideoToPhotosAlbum(filePath: string): Promise<void> {
  try {
    return new Promise((resolve, reject) => {
      uni.saveVideoToPhotosAlbum({
        filePath,
        success: () => {
          uni.showToast({ title: '保存成功', icon: 'success' })
          resolve()
        },
        fail: (err) => {
          if ((err as any).errMsg?.includes('cancel')) {
            reject(new Error('用户取消保存'))
          } else {
            reject(new Error(`保存视频失败: ${JSON.stringify(err)}`))
          }
        }
      })
    })
  } catch (error) {
    console.error('[Camera] saveVideoToPhotosAlbum error:', error)
    throw error
  }
}

/**
 * 切换摄像头
 * @param cameraId 摄像头ID
 */
export function switchCamera(cameraId?: string): void {
  // 在实际使用中，需要通过 video context 来操作
  // 这里只是一个占位符
  console.log('[Camera] switchCamera:', cameraId)
}

/**
 * 设置闪光灯模式
 * @param mode 闪光灯模式
 */
export function setFlashMode(mode: 'auto' | 'on' | 'off'): void {
  // 在实际使用中，需要通过 video context 来操作
  // 这里只是一个占位符
  console.log('[Camera] setFlashMode:', mode)
}

/**
 * 检查设备是否支持相机
 * @returns 是否支持相机
 */
export function isCameraAvailable(): boolean {
  // H5 环境可能不支持
  // #ifdef H5
  return false
  // #endif

  // 非 H5 环境默认支持
  // #ifndef H5
  return true
  // #endif
}

/**
 * 检查设备是否支持录制视频
 * @returns 是否支持录制视频
 */
export function isVideoRecordingAvailable(): boolean {
  // H5 环境可能不支持
  // #ifdef H5
  return false
  // #endif

  // 非 H5 环境默认支持
  // #ifndef H5
  return true
  // #endif
}
