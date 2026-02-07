/**
 * 客户相关 API
 */

import apiAdapter from './adapter'
import type { PageResponse } from '@/types'

export const customerApi = {
  /**
   * 获取客户列表
   */
  getList(params: {
    page: number
    pageSize: number
    keyword?: string
    industry?: string
    level?: number
  }): Promise<PageResponse<any>> {
    return apiAdapter.get<PageResponse<any>>('/api/customers', params)
  },

  /**
   * 获取客户详情
   */
  getDetail(id: number): Promise<any> {
    return apiAdapter.get<any>(`/api/customers/${id}`)
  },

  /**
   * 创建客户
   */
  create(data: any): Promise<any> {
    return apiAdapter.post<any>('/api/customers', data)
  },

  /**
   * 更新客户
   */
  update(id: number, data: any): Promise<any> {
    return apiAdapter.put<any>(`/api/customers/${id}`, data)
  },

  /**
   * 删除客户
   */
  delete(id: number): Promise<void> {
    return apiAdapter.delete<void>(`/api/customers/${id}`)
  }
}
