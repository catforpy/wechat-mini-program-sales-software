/**
 * 环境变量和工具函数
 */

/**
 * 获取当前环境
 */
export function getEnv(): 'development' | 'production' | 'testing' {
  // #ifdef H5
  return (import.meta.env.MODE as any) || 'production'
  // #endif

  // #ifndef H5
  // 小程序和 App 可以通过打包命令区分
  return 'production'
  // #endif
}

/**
 * 是否为开发环境
 */
export function isDev(): boolean {
  return getEnv() === 'development'
}

/**
 * 是否为生产环境
 */
export function isProd(): boolean {
  return getEnv() === 'production'
}

/**
 * 是否为测试环境
 */
export function isTest(): boolean {
  return getEnv() === 'testing'
}

/**
 * 获取平台信息
 */
export function getPlatform(): string {
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif

  // #ifdef MP-ALIPAY
  return 'mp-alipay'
  // #endif

  // #ifdef MP-BAIDU
  return 'mp-baidu'
  // #endif

  // #ifdef MP-TOUTIAO
  return 'mp-toutiao'
  // #endif

  // #ifdef H5
  return 'h5'
  // #endif

  // #ifdef APP-PLUS
  return 'app-plus'
  // #endif

  return 'unknown'
}

/**
 * 是否为微信小程序
 */
export function isWeixinMp(): boolean {
  // #ifdef MP-WEIXIN
  return true
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
}

/**
 * 是否为 H5
 */
export function isH5(): boolean {
  // #ifdef H5
  return true
  // #endif
  // #ifndef H5
  return false
  // #endif
}

/**
 * 是否为 App
 */
export function isApp(): boolean {
  // #ifdef APP-PLUS
  return true
  // #endif
  // #ifndef APP-PLUS
  return false
  // #endif
}

/**
 * 获取系统信息
 */
export function getSystemInfo() {
  return uni.getSystemInfoSync()
}

/**
 * 获取设备像素比
 */
export function getPixelRatio(): number {
  const systemInfo = getSystemInfo()
  return systemInfo.pixelRatio || 1
}

/**
 * 获取屏幕宽度
 */
export function getScreenWidth(): number {
  const systemInfo = getSystemInfo()
  return systemInfo.screenWidth || 375
}

/**
 * 获取屏幕高度
 */
export function getScreenHeight(): number {
  const systemInfo = getSystemInfo()
  return systemInfo.screenHeight || 667
}

/**
 * rpx 转 px
 */
export function rpxToPx(rpx: number): number {
  const screenWidth = getScreenWidth()
  return (rpx / 750) * screenWidth
}

/**
 * px 转 rpx
 */
export function pxToRpx(px: number): number {
  const screenWidth = getScreenWidth()
  return (px / screenWidth) * 750
}
