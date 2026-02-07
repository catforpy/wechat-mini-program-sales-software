/**
 * Mock API 接口
 * 模拟后端 API 响应
 */

import { sleep } from '@/utils'
import mockDataManager from './manager'

/**
 * 订单状态类型
 */
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled' | 'refunded'

/**
 * Mock API 响应
 */
interface MockApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

/**
 * Mock API 类
 */
class MockApi {
  private delay = 300 // 模拟网络延迟（毫秒）
  private errorRate = 0 // 错误率（0-1）

  /**
   * 设置延迟
   */
  setDelay(delay: number) {
    this.delay = delay
  }

  /**
   * 设置错误率
   */
  setErrorRate(rate: number) {
    this.errorRate = Math.max(0, Math.min(1, rate))
  }

  /**
   * 模拟网络请求
   */
  private async request<T = any>(handler: () => T): Promise<MockApiResponse<T>> {
    // 模拟网络延迟
    if (this.delay > 0) {
      await sleep(this.delay)
    }

    // 模拟随机错误
    if (this.errorRate > 0 && Math.random() < this.errorRate) {
      return {
        code: 500,
        message: '服务器错误',
        data: null as any,
        timestamp: Date.now()
      }
    }

    try {
      const data = await handler()
      return {
        code: 200,
        message: 'success',
        data,
        timestamp: Date.now()
      }
    } catch (error: any) {
      return {
        code: 500,
        message: error.message || '请求失败',
        data: null as any,
        timestamp: Date.now()
      }
    }
  }

  /**
   * 分页响应
   */
  private paginate<T = any>(list: T[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      list: list.slice(start, end),
      total: list.length,
      page,
      pageSize,
      hasMore: end < list.length
    }
  }

  // ==================== 认证相关 ====================

  /**
   * 用户登录
   */
  async login(username: string, password: string) {
    return this.request(async () => {
      const users = mockDataManager.getData('user')
      const user = users.find((u: any) => u.username === username)

      if (!user) {
        throw new Error('用户不存在')
      }

      if (user.password !== password) {
        throw new Error('密码错误')
      }

      // 返回用户信息和 token
      return {
        token: `mock_token_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        },
        expire: 7200 // 2小时
      }
    })
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    return this.request(async () => {
      // 默认返回第一个用户
      const users = mockDataManager.getData('user')
      const user = users[0]

      return {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    })
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(data: any) {
    return this.request(async () => {
      const users = mockDataManager.getData('user')
      const userId = users[0].id

      mockDataManager.updateData('user', userId, data)

      return { ...users[0], ...data }
    })
  }

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string) {
    return this.request(async () => {
      const users = mockDataManager.getData('user')
      const user = users[0]

      if (user.password !== oldPassword) {
        throw new Error('原密码错误')
      }

      mockDataManager.updateData('user', user.id, { password: newPassword })

      return { success: true }
    })
  }

  // ==================== 商品相关 ====================

  /**
   * 获取商品列表（分页）
   */
  async getProductList(params: {
    page: number
    pageSize: number
    keyword?: string
    category?: string
    status?: string
  }) {
    return this.request(async () => {
      const filters: any = {}
      if (params.category) filters.category = params.category
      if (params.status) filters.status = params.status
      if (params.keyword) filters.name = params.keyword

      const result = mockDataManager.getDataByPage('product', params.page, params.pageSize, filters)

      return result
    })
  }

  /**
   * 获取商品详情
   */
  async getProductDetail(id: number) {
    return this.request(async () => {
      const product = mockDataManager.getDataById('product', id)
      if (!product) {
        throw new Error('商品不存在')
      }
      return product
    })
  }

  /**
   * 创建商品
   */
  async createProduct(data: any) {
    return this.request(async () => {
      return mockDataManager.addData('product', data)
    })
  }

  /**
   * 更新商品
   */
  async updateProduct(id: number, data: any) {
    return this.request(async () => {
      const success = mockDataManager.updateData('product', id, data)
      if (!success) {
        throw new Error('商品不存在')
      }
      return mockDataManager.getDataById('product', id)
    })
  }

  /**
   * 删除商品
   */
  async deleteProduct(id: number) {
    return this.request(async () => {
      const success = mockDataManager.deleteData('product', id)
      if (!success) {
        throw new Error('商品不存在')
      }
      return { success: true }
    })
  }

  // ==================== 订单相关 ====================

  /**
   * 获取订单列表（分页）
   */
  async getOrderList(params: {
    page: number
    pageSize: number
    status?: OrderStatus
    keyword?: string
    startDate?: string
    endDate?: string
  }) {
    return this.request(async () => {
      const filters: any = {}
      if (params.status) filters.status = params.status
      if (params.keyword) filters.orderNo = params.keyword

      const result = mockDataManager.getDataByPage('order', params.page, params.pageSize, filters)

      return result
    })
  }

  /**
   * 获取订单详情
   */
  async getOrderDetail(id: number) {
    return this.request(async () => {
      const order = mockDataManager.getDataById('order', id)
      if (!order) {
        throw new Error('订单不存在')
      }
      return order
    })
  }

  /**
   * 创建订单
   */
  async createOrder(data: {
    productId: number
    quantity: number
    amount: number
  }) {
    return this.request(async () => {
      const users = mockDataManager.getData('user')
      const products = mockDataManager.getData('product')
      const product = products.find((p: any) => p.id === data.productId)

      if (!product) {
        throw new Error('商品不存在')
      }

      const order = {
        orderNo: `ORD${Date.now()}`,
        userId: users[0].id,
        userName: users[0].nickname,
        productId: product.id,
        productName: product.name,
        quantity: data.quantity,
        amount: data.amount,
        status: 'pending',
        createTime: new Date().toISOString()
      }

      return mockDataManager.addData('order', order)
    })
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(id: number, status: OrderStatus) {
    return this.request(async () => {
      const success = mockDataManager.updateData('order', id, { status })
      if (!success) {
        throw new Error('订单不存在')
      }

      // 添加相应的时间戳
      const updateData: any = { status }
      if (status === 'paid') updateData.payTime = new Date().toISOString()
      if (status === 'shipped') updateData.shipTime = new Date().toISOString()

      mockDataManager.updateData('order', id, updateData)

      return mockDataManager.getDataById('order', id)
    })
  }

  // ==================== 客户相关 ====================

  /**
   * 获取客户列表（分页）
   */
  async getCustomerList(params: {
    page: number
    pageSize: number
    keyword?: string
    industry?: string
    level?: number
  }) {
    return this.request(async () => {
      const filters: any = {}
      if (params.keyword) filters.name = params.keyword
      if (params.industry) filters.industry = params.industry
      if (params.level) filters.level = params.level

      const result = mockDataManager.getDataByPage('customer', params.page, params.pageSize, filters)

      return result
    })
  }

  /**
   * 获取客户详情
   */
  async getCustomerDetail(id: number) {
    return this.request(async () => {
      const customer = mockDataManager.getDataById('customer', id)
      if (!customer) {
        throw new Error('客户不存在')
      }
      return customer
    })
  }

  /**
   * 创建客户
   */
  async createCustomer(data: any) {
    return this.request(async () => {
      return mockDataManager.addData('customer', data)
    })
  }

  /**
   * 更新客户
   */
  async updateCustomer(id: number, data: any) {
    return this.request(async () => {
      const success = mockDataManager.updateData('customer', id, data)
      if (!success) {
        throw new Error('客户不存在')
      }
      return mockDataManager.getDataById('customer', id)
    })
  }

  /**
   * 删除客户
   */
  async deleteCustomer(id: number) {
    return this.request(async () => {
      const success = mockDataManager.deleteData('customer', id)
      if (!success) {
        throw new Error('客户不存在')
      }
      return { success: true }
    })
  }

  // ==================== 统计相关 ====================

  /**
   * 获取统计数据
   */
  async getStatistics() {
    return this.request(async () => {
      return mockDataManager.generateStatistics()
    })
  }

  /**
   * 获取订单统计（按日期）
   */
  async getOrderStats(params: { startDate: string; endDate: string }) {
    return this.request(async () => {
      // 生成过去30天的数据
      const stats = []
      const startDate = new Date(params.startDate)
      const endDate = new Date(params.endDate)

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        stats.push({
          date: d.toISOString().split('T')[0],
          orderCount: Math.floor(Math.random() * 50) + 10,
          orderAmount: Math.floor(Math.random() * 50000) + 10000
        })
      }

      return stats
    })
  }

  /**
   * 获取商品销售排行
   */
  async getProductRanking(params: { limit?: number }) {
    return this.request(async () => {
      const products = mockDataManager.getData('product')
      const orders = mockDataManager.getData('order')

      // 统计每个商品的销售数量
      const salesMap = new Map<number, number>()
      orders.forEach((order: any) => {
        const count = salesMap.get(order.productId) || 0
        salesMap.set(order.productId, count + order.quantity)
      })

      // 排序
      const ranking = products
        .map((product: any) => ({
          ...product,
          salesCount: salesMap.get(product.id) || 0,
          salesAmount: (salesMap.get(product.id) || 0) * product.price
        }))
        .sort((a: any, b: any) => b.salesCount - a.salesCount)
        .slice(0, params.limit || 10)

      return ranking
    })
  }

  // ==================== 文件上传 ====================

  /**
   * 上传文件
   */
  async uploadFile(filePath: string) {
    return this.request(async () => {
      // 模拟上传延迟
      await sleep(1000)

      // 返回模拟的文件 URL
      return {
        url: `https://mock.example.com/uploads/${Date.now()}.jpg`,
        filename: `file_${Date.now()}.jpg`,
        size: Math.floor(Math.random() * 1024 * 1024)
      }
    })
  }
}

// 创建单例
const mockApi = new MockApi()

export default mockApi
