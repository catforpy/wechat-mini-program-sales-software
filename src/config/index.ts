/**
 * 全局配置文件
 * 根据不同环境加载不同配置
 */

import type { RequestConfig } from '@/types'

/**
 * 基础配置接口
 */
interface BaseConfig {
  baseURL: string
  apiVersion: string
  timeout: number
  uploadTimeout: number
  downloadTimeout: number
}

/**
 * 开发环境配置
 */
const developmentConfig: BaseConfig = {
  baseURL: 'https://dev-api.example.com',
  apiVersion: '/v1',
  timeout: 15000,
  uploadTimeout: 60000,
  downloadTimeout: 60000
}

/**
 * 生产环境配置
 */
const productionConfig: BaseConfig = {
  baseURL: 'https://api.example.com',
  apiVersion: '/v1',
  timeout: 10000,
  uploadTimeout: 60000,
  downloadTimeout: 60000
}

/**
 * 测试环境配置
 */
const testingConfig: BaseConfig = {
  baseURL: 'https://test-api.example.com',
  apiVersion: '/v1',
  timeout: 15000,
  uploadTimeout: 60000,
  downloadTimeout: 60000
}

/**
 * 根据环境获取配置
 */
function getConfigByEnv(): BaseConfig {
  // #ifdef H5
  const env = import.meta.env.MODE || 'development'
  // #endif

  // #ifndef H5
  const env = 'production' // 小程序和 App 默认为生产环境
  // #endif

  switch (env) {
    case 'development':
      return developmentConfig
    case 'production':
      return productionConfig
    case 'testing':
      return testingConfig
    default:
      return productionConfig
  }
}

const baseConfig = getConfigByEnv()

/**
 * 应用配置
 */
export const appConfig = {
  // API 配置
  api: {
    baseURL: baseConfig.baseURL,
    apiVersion: baseConfig.apiVersion,
    timeout: baseConfig.timeout,
    uploadTimeout: baseConfig.uploadTimeout,
    downloadTimeout: baseConfig.downloadTimeout,

    // 是否显示请求日志
    showLog: baseConfig === developmentConfig,

    // 是否显示 loading
    showLoading: true,
    loadingText: '加载中...',

    // 是否显示错误提示
    showError: true,

    // 默认重试次数
    retryCount: 2,

    // 重试延迟（毫秒）
    retryDelay: 1000
  },

  // 缓存配置
  cache: {
    // 是否启用内存缓存
    enableMemoryCache: true,

    // 内存缓存最大数量
    memoryCacheMax: 100,

    // 是否启用本地存储缓存
    enableStorageCache: true,

    // 默认缓存时间（毫秒）
    defaultTTL: 30 * 60 * 1000, // 30 分钟

    // 缓存键前缀
    prefix: 'app_cache_'
  },

  // 存储配置
  storage: {
    // 是否启用加密
    enableEncrypt: false,

    // 默认过期时间（毫秒）
    defaultExpire: 7 * 24 * 60 * 60 * 1000 // 7 天
  },

  // 数据库配置
  database: {
    // 数据库名称
    name: 'app_database',

    // 数据库版本
    version: 1,

    // 是否启用日志
    enableLog: true
  },

  // 应用信息
  app: {
    name: '销售app会都',
    version: '1.0.0',
    versionCode: 100
  },

  // 分页配置
  pagination: {
    defaultPageSize: 20,
    pageSizes: [10, 20, 50, 100],
    maxPageSize: 100
  },

  // 上传配置
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxSizeImage: 5 * 1024 * 1024, // 5MB
    maxSizeVideo: 50 * 1024 * 1024, // 50MB
    allowTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowVideoTypes: ['video/mp4', 'video/webm']
  },

  // 性能配置
  performance: {
    // 是否启用性能监控
    enableMonitor: true,

    // 慢接口阈值（毫秒）
    slowApiThreshold: 3000,

    // 是否启用虚拟列表
    enableVirtualList: true,

    // 虚拟列表每项高度
    virtualItemHeight: 50
  }
} as const

/**
 * 获取完整的 API URL
 */
export function getApiUrl(path: string): string {
  const baseUrl = appConfig.api.baseURL
  const version = appConfig.api.apiVersion

  // 移除路径开头的斜杠
  const cleanPath = path.replace(/^\/+/, '')

  return `${baseUrl}${version}/${cleanPath}`
}

/**
 * 获取上传 URL
 */
export function getUploadUrl(): string {
  return `${appConfig.api.baseURL}${appConfig.api.apiVersion}/upload`
}

/**
 * 获取下载 URL
 */
export function getDownloadUrl(path: string): string {
  return `${appConfig.api.baseURL}${appConfig.api.apiVersion}/download/${path}`
}

export default appConfig
