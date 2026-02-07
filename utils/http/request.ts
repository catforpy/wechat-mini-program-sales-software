/**
 * HTTP 请求封装
 * 高性能、可扩展的 HTTP 请求类
 * 支持拦截器、缓存、重试、并发控制等功能
 */

import type { RequestConfig, ApiResponse } from '@/types'
import { appConfig } from '@/config'
import { CacheManager } from '../performance/cache'
import { TokenManager } from './token-manager'
import { showErrorToast, showLoading, hideLoading } from '../ui'

/**
 * 请求拦截器类型
 */
interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>
}

/**
 * 响应拦截器类型
 */
interface ResponseInterceptor {
  (response: any): any
}

/**
 * 错误拦截器类型
 */
interface ErrorInterceptor {
  (error: any): any
}

/**
 * 拦截器管理器
 */
class InterceptorManager<T> {
  private interceptors: T[] = []

  /**
   * 添加拦截器
   */
  use(interceptor: T): number {
    this.interceptors.push(interceptor)
    return this.interceptors.length - 1
  }

  /**
   * 移除拦截器
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors.splice(id, 1)
    }
  }

  /**
   * 获取所有拦截器
   */
  getAll(): T[] {
    return this.interceptors
  }
}

/**
 * HTTP 请求类
 */
class HttpRequest {
  private requestInterceptors = new InterceptorManager<RequestInterceptor>()
  private responseInterceptors = new InterceptorManager<ResponseInterceptor>()
  private errorInterceptors = new InterceptorManager<ErrorInterceptor>()
  private cache = new CacheManager({ maxSize: 50 })
  private pendingRequests = new Map<string, Promise<any>>()
  private tokenManager = TokenManager.getInstance()

  constructor() {
    this.setupDefaultInterceptors()
  }

  /**
   * 设置默认拦截器
   */
  private setupDefaultInterceptors() {
    // 请求拦截器 - 添加 Token
    this.requestInterceptors.use((config) => {
      const token = this.tokenManager.getToken()
      if (token) {
        config.header = {
          ...config.header,
          Authorization: `Bearer ${token}`
        }
      }
      return config
    })

    // 响应拦截器 - 统一处理响应
    this.responseInterceptors.use((response) => {
      return response.data
    })

    // 错误拦截器 - 统一错误处理
    this.errorInterceptors.use((error) => {
      return this.handleError(error)
    })
  }

  /**
   * 请求方法
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const startTime = Date.now()

    try {
      // 应用请求拦截器
      let finalConfig = config
      for (const interceptor of this.requestInterceptors.getAll()) {
        finalConfig = await interceptor(finalConfig)
      }

      // 检查缓存
      if (finalConfig.cache && finalConfig.method === 'GET') {
        const cached = await this.getFromCache<T>(finalConfig)
        if (cached) {
          return cached
        }
      }

      // 显示 Loading
      if (finalConfig.showLoading !== false) {
        showLoading(finalConfig.loadingText || appConfig.api.showLoading)
      }

      // 发起请求（支持重试）
      const response = await this.requestWithRetry<T>(finalConfig)

      // 记录性能日志
      const duration = Date.now() - startTime
      this.logPerformance(finalConfig, duration)

      // 缓存响应
      if (finalConfig.cache && finalConfig.method === 'GET') {
        await this.setCache(finalConfig, response)
      }

      // 应用响应拦截器
      let finalResponse = response
      for (const interceptor of this.responseInterceptors.getAll()) {
        finalResponse = await interceptor(finalResponse)
      }

      return finalResponse
    } catch (error) {
      // 应用错误拦截器
      let finalError = error
      for (const interceptor of this.errorInterceptors.getAll()) {
        finalError = await interceptor(finalError)
      }
      throw finalError
    } finally {
      // 隐藏 Loading
      if (config.showLoading !== false) {
        hideLoading()
      }
    }
  }

  /**
   * 带重试的请求
   */
  private async requestWithRetry<T>(
    config: RequestConfig,
    retryCount = 0
  ): Promise<any> {
    const maxRetries = config.retry ?? appConfig.api.retryCount

    try {
      return await this.uniRequest<T>(config)
    } catch (error: any) {
      // 判断是否需要重试
      const shouldRetry =
        retryCount < maxRetries &&
        this.isNetworkError(error) &&
        config.method === 'GET'

      if (shouldRetry) {
        const delay = appConfig.api.retryDelay * (retryCount + 1)
        await this.sleep(delay)
        return this.requestWithRetry<T>(config, retryCount + 1)
      }

      throw error
    }
  }

  /**
   * uni.request 封装
   */
  private uniRequest<T>(config: RequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      const fullUrl = this.buildFullUrl(config.url, config.params)

      const requestOptions: UniApp.RequestOptions = {
        url: fullUrl,
        method: (config.method || 'GET') as any,
        data: config.data,
        header: {
          'Content-Type': 'application/json',
          ...config.header
        },
        timeout: config.timeout || appConfig.api.timeout,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject({
              statusCode: res.statusCode,
              data: res.data,
              message: `请求失败: ${res.statusCode}`
            })
          }
        },
        fail: (err) => {
          reject({
            statusCode: 0,
            message: err.errMsg || '网络请求失败',
            error: err
          })
        }
      }

      uni.request(requestOptions)
    })
  }

  /**
   * 构建完整 URL
   */
  private buildFullUrl(url: string, params?: any): string {
    // 如果是完整 URL，直接返回
    if (/^https?:\/\//.test(url)) {
      const fullUrl = params ? this.appendQuery(url, params) : url
      return fullUrl
    }

    // 拼接基础 URL
    let fullUrl = url.startsWith('/')
      ? `${appConfig.api.baseURL}${url}`
      : `${appConfig.api.baseURL}/${url}`

    // 添加查询参数
    if (params) {
      fullUrl = this.appendQuery(fullUrl, params)
    }

    return fullUrl
  }

  /**
   * 添加查询参数
   */
  private appendQuery(url: string, params: any): string {
    const query = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    return query ? `${url}${url.includes('?') ? '&' : '?'}${query}` : url
  }

  /**
   * 从缓存获取数据
   */
  private async getFromCache<T>(config: RequestConfig): Promise<ApiResponse<T> | null> {
    const cacheKey = this.buildCacheKey(config)
    const cached = this.cache.get<ApiResponse<T>>(cacheKey)

    if (cached) {
      console.log(`[Cache Hit] ${config.url}`)
      return cached
    }

    return null
  }

  /**
   * 设置缓存
   */
  private async setCache<T>(config: RequestConfig, response: ApiResponse<T>): Promise<void> {
    const cacheKey = this.buildCacheKey(config)
    const ttl = typeof config.cache === 'number' ? config.cache : appConfig.cache.defaultTTL

    this.cache.set(cacheKey, response, ttl)
    console.log(`[Cache Set] ${config.url}, TTL: ${ttl}ms`)
  }

  /**
   * 构建缓存键
   */
  private buildCacheKey(config: RequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`
  }

  /**
   * 错误处理
   */
  private handleError(error: any) {
    let message = '请求失败'

    if (error.statusCode) {
      switch (error.statusCode) {
        case 401:
          message = '未授权，请重新登录'
          this.tokenManager.clearToken()
          // 跳转到登录页
          uni.navigateTo({ url: '/pages/user/login/index' })
          break
        case 403:
          message = '没有权限访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = error.message || `请求失败 (${error.statusCode})`
      }
    } else if (error.message) {
      message = error.message
    }

    // 显示错误提示
    if (appConfig.api.showError) {
      showErrorToast(message)
    }

    return Promise.reject({ ...error, message })
  }

  /**
   * 判断是否为网络错误
   */
  private isNetworkError(error: any): boolean {
    return (
      error.statusCode === 0 ||
      error.message?.includes('timeout') ||
      error.message?.includes('network')
    )
  }

  /**
   * 记录性能日志
   */
  private logPerformance(config: RequestConfig, duration: number) {
    const threshold = appConfig.performance.slowApiThreshold
    const isSlow = duration > threshold

    const logMessage = `[API] ${config.method} ${config.url} - ${duration}ms`

    if (appConfig.api.showLog) {
      if (isSlow) {
        console.warn(`⚠️ ${logMessage} (慢接口)`)
      } else {
        console.log(logMessage)
      }
    }

    // 性能监控
    if (appConfig.performance.enableMonitor && isSlow) {
      // 上报慢接口
      this.reportSlowApi(config, duration)
    }
  }

  /**
   * 上报慢接口
   */
  private reportSlowApi(config: RequestConfig, duration: number) {
    // TODO: 接入性能监控平台
    console.warn('Slow API detected:', {
      url: config.url,
      method: config.method,
      duration
    })
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config
    })
  }

  /**
   * POST 请求
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...config
    })
  }

  /**
   * 上传文件
   */
  upload<T = any>(url: string, filePath: string, config?: Partial<RequestConfig>): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = this.tokenManager.getToken()

      uni.uploadFile({
        url: this.buildFullUrl(url),
        filePath,
        name: 'file',
        header: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        timeout: appConfig.api.uploadTimeout,
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data)
            resolve(data)
          } else {
            reject({
              statusCode: res.statusCode,
              message: '上传失败'
            })
          }
        },
        fail: (err) => {
          reject({
            statusCode: 0,
            message: err.errMsg || '上传失败'
          })
        }
      })
    })
  }

  /**
   * 下载文件
   */
  download(url: string, config?: Partial<RequestConfig>): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = this.tokenManager.getToken()

      uni.downloadFile({
        url: this.buildFullUrl(url),
        header: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        timeout: appConfig.api.downloadTimeout,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            reject({
              statusCode: res.statusCode,
              message: '下载失败'
            })
          }
        },
        fail: (err) => {
          reject({
            statusCode: 0,
            message: err.errMsg || '下载失败'
          })
        }
      })
    })
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor: RequestInterceptor): number {
    return this.requestInterceptors.use(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): number {
    return this.responseInterceptors.use(interceptor)
  }

  /**
   * 添加错误拦截器
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): number {
    return this.errorInterceptors.use(interceptor)
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.cache.clear()
    console.log('[HTTP] 所有缓存已清除')
  }

  /**
   * 清除指定 URL 的缓存
   */
  clearUrlCache(url: string, method = 'GET'): void {
    const pattern = `${method}:${url}`
    this.cache.clearByPattern(pattern)
    console.log(`[HTTP] 已清除 ${url} 的缓存`)
  }
}

// 创建单例
const httpRequest = new HttpRequest()

export default httpRequest
export { HttpRequest }
