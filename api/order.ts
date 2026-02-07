/**
 * 订单相关 API
 */

import apiAdapter from './adapter'
import type { PageResponse, OrderInfo } from '@/types'

export const orderApi = {
  /**
   * 获取订单列表
   */
  getList(params: {
    page: number
    pageSize: number
    status?: string
    keyword?: string
    startDate?: string
    endDate?: string
  }): Promise<PageResponse<OrderInfo>> {
    return apiAdapter.get<PageResponse<OrderInfo>>('/api/orders', params)
  },

  /**
   * 获取订单详情
   */
  getDetail(id: number): Promise<OrderInfo> {
    return apiAdapter.get<OrderInfo>(`/api/orders/${id}`)
  },

  /**
   * 创建订单
   */
  create(data: {
    productId: number
    quantity: number
    amount: number
  }): Promise<OrderInfo> {
    return apiAdapter.post<OrderInfo>('/api/orders', data)
  },

  /**
   * 更新订单状态
   */
  updateStatus(id: number, status: string): Promise<void> {
    return apiAdapter.put<void>(`/api/orders/${id}/status`, { status })
  },

  /**
   * 取消订单
   */
  cancel(id: number): Promise<void> {
    return apiAdapter.post<void>(`/api/orders/${id}/cancel`)
  }
}
