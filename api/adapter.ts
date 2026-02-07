/**
 * API 适配器
 * 自动切换 Mock 数据和真实 API
 */

import { isMockEnabled, mockLog } from '@/config/mock'
import mockApi from '@/mock/api'
import { httpRequest } from '@/utils'

/**
 * API 适配器类
 */
class ApiAdapter {
  /**
   * 适配 GET 请求
   */
  async get<T = any>(url: string, params?: any): Promise<T> {
    if (isMockEnabled()) {
      mockLog('GET', url, params)
      return this.mockToReal(mockApi.get(url.replace('/api/', '') as any), url)
    }

    return httpRequest.get<T>(url, params)
  }

  /**
   * 适配 POST 请求
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    if (isMockEnabled()) {
      mockLog('POST', url, data)
      return this.mockToReal(mockApi.post(url.replace('/api/', '') as any, data), url)
    }

    return httpRequest.post<T>(url, data)
  }

  /**
   * 适配 PUT 请求
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    if (isMockEnabled()) {
      mockLog('PUT', url, data)
      return this.mockToReal(mockApi.put(url.replace('/api/', '') as any, data), url)
    }

    return httpRequest.put<T>(url, data)
  }

  /**
   * 适配 DELETE 请求
   */
  async delete<T = any>(url: string, data?: any): Promise<T> {
    if (isMockEnabled()) {
      mockLog('DELETE', url, data)
      return this.mockToReal(mockApi.delete(url.replace('/api/', '') as any), url)
    }

    return httpRequest.delete<T>(url, data)
  }

  /**
   * 将 Mock 响应转换为真实响应格式
   */
  private async mockToReal<T>(mockPromise: Promise<any>, url: string): Promise<T> {
    const response = await mockPromise

    // 如果返回的是标准的响应格式，直接返回 data
    if (response && 'code' in response) {
      if (response.code === 200) {
        return response.data as T
      } else {
        throw new Error(response.message)
      }
    }

    return response as T
  }
}

// 创建单例
const apiAdapter = new ApiAdapter()

export default apiAdapter
