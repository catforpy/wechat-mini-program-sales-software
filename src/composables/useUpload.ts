/**
 * 上传相关的 Composable
 */
import { ref, computed } from 'vue'
import { httpRequest } from '@/utils'
import { showSuccess, showErrorToast } from '@/utils/ui'

export function useUpload() {
  const uploading = ref(false)
  const progress = ref(0)

  /**
   * 选择图片
   */
  const chooseImage = async (options?: {
    count?: number
    sizeType?: Array<'original' | 'compressed'>
    sourceType?: Array<'album' | 'camera'>
  }) => {
    try {
      const res = await uni.chooseImage({
        count: options?.count || 9,
        sizeType: options?.sizeType || ['compressed'],
        sourceType: options?.sourceType || ['album', 'camera']
      })
      return res.tempFilePaths
    } catch (error) {
      console.error('[useUpload] 选择图片失败:', error)
      return []
    }
  }

  /**
   * 上传单个文件
   */
  const uploadFile = async (filePath: string): Promise<string | null> => {
    try {
      uploading.value = true
      progress.value = 0

      const result = await httpRequest.upload('/upload', filePath)

      showSuccess('上传成功')
      return result.url
    } catch (error) {
      console.error('[useUpload] 上传失败:', error)
      showErrorToast('上传失败')
      return null
    } finally {
      uploading.value = false
      progress.value = 0
    }
  }

  /**
   * 上传多个文件
   */
  const uploadFiles = async (
    filePaths: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> => {
    const results: string[] = []

    for (let i = 0; i < filePaths.length; i++) {
      const url = await uploadFile(filePaths[i])
      if (url) {
        results.push(url)
      }
      onProgress?.(i + 1, filePaths.length)
    }

    return results
  }

  /**
   * 选择并上传图片
   */
  const chooseAndUpload = async (options?: {
    count?: number
    onSuccess?: (urls: string[]) => void
  }) => {
    const filePaths = await chooseImage({ count: options?.count || 1 })
    if (filePaths.length === 0) return []

    const urls = await uploadFiles(filePaths)
    if (urls.length > 0 && options?.onSuccess) {
      options.onSuccess(urls)
    }

    return urls
  }

  return {
    uploading: computed(() => uploading.value),
    progress: computed(() => progress.value),
    chooseImage,
    uploadFile,
    uploadFiles,
    chooseAndUpload
  }
}

/**
 * 拍照并上传
 */
export function useCamera() {
  const uploading = ref(false)

  /**
   * 拍照
   */
  const takePhoto = async () => {
    try {
      const res = await uni.chooseImage({
        count: 1,
        sourceType: ['camera']
      })
      return res.tempFilePaths[0]
    } catch (error) {
      console.error('[useCamera] 拍照失败:', error)
      return null
    }
  }

  /**
   * 拍照并上传
   */
  const takeAndUpload = async (): Promise<string | null> => {
    const filePath = await takePhoto()
    if (!filePath) return null

    const { uploadFile } = useUpload()
    return await uploadFile(filePath)
  }

  return {
    uploading: computed(() => uploading.value),
    takePhoto,
    takeAndUpload
  }
}
