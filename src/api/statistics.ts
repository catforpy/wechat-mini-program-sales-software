/**
 * 统计相关 API
 */

import apiAdapter from './adapter'

export const statisticsApi = {
  /**
   * 获取统计数据
   */
  getStatistics(): Promise<any> {
    return apiAdapter.get('/api/statistics')
  },

  /**
   * 获取订单统计
   */
  getOrderStats(params: {
    startDate: string
    endDate: string
  }): Promise<any[]> {
    return apiAdapter.get('/api/statistics/orders', params)
  },

  /**
   * 获取商品销售排行
   */
  getProductRanking(params?: { limit?: number }): Promise<any[]> {
    return apiAdapter.get('/api/statistics/product-ranking', params)
  }
}
