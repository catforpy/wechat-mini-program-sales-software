/**
 * UI 工具函数
 * 封装 uni.showModal、uni.showToast、uni.showLoading 等
 */

/**
 * 显示 Toast 提示
 */
export function showToast(
  title: string,
  icon: 'success' | 'error' | 'fail' | 'exception' | 'loading' | 'none' = 'none',
  duration = 2000
): void {
  uni.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示成功提示
 */
export function showSuccess(title: string, duration = 2000): void {
  showToast(title, 'success', duration)
}

/**
 * 显示错误提示
 */
export function showErrorToast(title: string, duration = 2000): void {
  showToast(title, 'error', duration)
}

/**
 * 显示 Loading
 */
export function showLoading(title = '加载中...', mask = true): void {
  uni.showLoading({
    title,
    mask
  })
}

/**
 * 隐藏 Loading
 */
export function hideLoading(): void {
  uni.hideLoading()
}

/**
 * 显示确认对话框
 */
export function showConfirm(
  title: string,
  content?: string
): Promise<boolean> {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content: content || '',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 显示警告对话框
 */
export function showAlert(title: string, content?: string): Promise<void> {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content: content || '',
      showCancel: false,
      confirmText: '知道了',
      success: () => {
        resolve()
      },
      fail: () => {
        resolve()
      }
    })
  })
}

/**
 * 显示操作菜单
 */
export function showActionSheet(itemList: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    uni.showActionSheet({
      itemList,
      success: (res) => {
        resolve(res.tapIndex)
      },
      fail: () => {
        reject(new Error('用户取消'))
      }
    })
  })
}

/**
 * 导航到指定页面
 */
export function navigateTo(
  url: string,
  params?: Record<string, any>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const fullUrl = params ? `${url}?${buildQuery(params)}` : url

    uni.navigateTo({
      url: fullUrl,
      success: () => {
        resolve()
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 重定向到指定页面
 */
export function redirectTo(
  url: string,
  params?: Record<string, any>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const fullUrl = params ? `${url}?${buildQuery(params)}` : url

    uni.redirectTo({
      url: fullUrl,
      success: () => {
        resolve()
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 切换 Tab 页面
 */
export function switchTab(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.switchTab({
      url,
      success: () => {
        resolve()
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 返回上一页
 */
export function navigateBack(delta = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.navigateBack({
      delta,
      success: () => {
        resolve()
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 构建查询字符串
 */
function buildQuery(params: Record<string, any>): string {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
}

/**
 * 下拉刷新
 */
export function startPullDownRefresh(): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.startPullDownRefresh({
      success: () => {
        resolve()
      },
      fail: () => {
        reject()
      }
    })
  })
}

/**
 * 停止下拉刷新
 */
export function stopPullDownRefresh(): void {
  uni.stopPullDownRefresh()
}

/**
 * 设置页面标题
 */
export function setNavigationBarTitle(title: string): void {
  uni.setNavigationBarTitle({
    title
  })
}

/**
 * 显示导航栏加载
 */
export function showNavigationBarLoading(): void {
  uni.showNavigationBarLoading()
}

/**
 * 隐藏导航栏加载
 */
export function hideNavigationBarLoading(): void {
  uni.hideNavigationBarLoading()
}

/**
 * 复制到剪贴板
 */
export function setClipboardData(data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data,
      success: () => {
        showSuccess('已复制')
        resolve()
      },
      fail: () => {
        showErrorToast('复制失败')
        reject()
      }
    })
  })
}

/**
 * 扫码
 */
export function scanCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.scanCode({
      success: (res) => {
        resolve(res.result)
      },
      fail: () => {
        reject(new Error('扫码失败'))
      }
    })
  })
}

/**
 * 选择图片
 */
export function chooseImage(options?: {
  count?: number
  sizeType?: Array<'original' | 'compressed'>
  sourceType?: Array<'album' | 'camera'>
}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: options?.count || 9,
      sizeType: options?.sizeType || ['compressed'],
      sourceType: options?.sourceType || ['album', 'camera'],
      success: (res) => {
        resolve(res.tempFilePaths)
      },
      fail: () => {
        reject(new Error('选择图片失败'))
      }
    })
  })
}

/**
 * 预览图片
 */
export function previewImage(urls: string[], current?: number | string): void {
  uni.previewImage({
    urls,
    current: current || 0
  })
}

/**
 * 保存图片到相册
 */
export function saveImageToPhotosAlbum(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        showSuccess('已保存到相册')
        resolve()
      },
      fail: () => {
        showErrorToast('保存失败')
        reject()
      }
    })
  })
}

/**
 * 拨打电话
 */
export function makePhoneCall(phoneNumber: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.makePhoneCall({
      phoneNumber,
      success: () => {
        resolve()
      },
      fail: () => {
        reject()
      }
    })
  })
}
