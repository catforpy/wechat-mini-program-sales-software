/**
 * 商品相关 API
 */

import apiAdapter from './adapter'
import type { PageResponse, ProductInfo } from '@/types'

export const productApi = {
  /**
   * 获取商品列表
   */
  getList(params: {
    page: number
    pageSize: number
    keyword?: string
    category?: string
    status?: string
  }): Promise<PageResponse<ProductInfo>> {
    return apiAdapter.get<PageResponse<ProductInfo>>('/api/products', params)
  },

  /**
   * 获取商品详情
   */
  getDetail(id: number): Promise<ProductInfo> {
    return apiAdapter.get<ProductInfo>(`/api/products/${id}`)
  },

  /**
   * 创建商品
   */
  create(data: Partial<ProductInfo>): Promise<ProductInfo> {
    return apiAdapter.post<ProductInfo>('/api/products', data)
  },

  /**
   * 更新商品
   */
  update(id: number, data: Partial<ProductInfo>): Promise<ProductInfo> {
    return apiAdapter.put<ProductInfo>(`/api/products/${id}`, data)
  },

  /**
   * 删除商品
   */
  delete(id: number): Promise<void> {
    return apiAdapter.delete<void>(`/api/products/${id}`)
  }
}
