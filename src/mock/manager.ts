/**
 * Mock 数据管理器
 * 负责生成、存储和管理虚拟数据
 */

import { randomString, uuid, formatDate } from '../utils/format'
import Storage from '../utils/storage'

/**
 * Mock 数据类型
 */
export type MockDataType = 'user' | 'order' | 'product' | 'customer' | 'statistics'

/**
 * Mock 数据管理器
 */
class MockDataManager {
  private data: Map<string, any[]> = new Map()
  private enabled = true

  /**
   * 初始化 Mock 数据
   */
  async init() {
    // 从本地存储加载
    await this.loadFromStorage()

    // 如果没有数据，生成初始数据
    if (this.data.size === 0) {
      this.generateInitialData()
      await this.saveToStorage()
    }
  }

  /**
   * 生成初始数据
   */
  private generateInitialData() {
    // 生成用户数据
    this.data.set('user', this.generateUsers(10))

    // 生成商品数据
    this.data.set('product', this.generateProducts(50))

    // 生成订单数据
    this.data.set('order', this.generateOrders(100))

    // 生成客户数据
    this.data.set('customer', this.generateCustomers(30))

    console.log('[Mock] 初始数据已生成')
  }

  /**
   * 生成用户数据
   */
  private generateUsers(count: number) {
    const users = []
    const roles = ['admin', 'user', 'guest']
    const statuses = ['active', 'inactive']

    for (let i = 0; i < count; i++) {
      users.push({
        id: i + 1,
        username: `user${i + 1}`,
        password: '123456', // 默认密码
        nickname: `用户${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        email: `user${i + 1}@example.com`,
        phone: `138${String(i).padStart(8, '0')}`,
        role: roles[i % 3],
        status: statuses[i % 2],
        createTime: formatDate(new Date(Date.now() - i * 86400000)),
        updateTime: formatDate(new Date())
      })
    }

    return users
  }

  /**
   * 生成商品数据
   */
  private generateProducts(count: number) {
    const products = []
    const categories = ['电子产品', '服装鞋帽', '食品饮料', '家居用品', '图书文具']
    const statuses = ['online', 'offline']

    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length]
      products.push({
        id: i + 1,
        name: `${category} - 商品${i + 1}`,
        description: `这是一款${category}，质量优良，价格实惠。`,
        price: Math.floor(Math.random() * 10000) / 100,
        stock: Math.floor(Math.random() * 1000),
        category,
        images: [
          `https://picsum.photos/400/400?random=${i}`,
          `https://picsum.photos/400/400?random=${i + 100}`
        ],
        status: statuses[i % 2],
        createTime: formatDate(new Date(Date.now() - i * 86400000))
      })
    }

    return products
  }

  /**
   * 生成订单数据
   */
  private generateOrders(count: number) {
    const orders = []
    const statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
    const users = this.data.get('user') || []
    const products = this.data.get('product') || []

    for (let i = 0; i < count; i++) {
      const user = users[i % users.length]
      const product = products[i % products.length]
      const quantity = Math.floor(Math.random() * 5) + 1

      orders.push({
        id: i + 1,
        orderNo: `ORD${Date.now() + i}`,
        userId: user.id,
        userName: user.nickname,
        productId: product.id,
        productName: product.name,
        quantity,
        amount: (product.price * quantity).toFixed(2),
        status: statuses[i % statuses.length],
        payTime: i % 5 === 1 ? formatDate(new Date(Date.now() - i * 3600000)) : null,
        shipTime: i % 5 === 2 ? formatDate(new Date(Date.now() - i * 3600000)) : null,
        createTime: formatDate(new Date(Date.now() - i * 86400000))
      })
    }

    return orders
  }

  /**
   * 生成客户数据
   */
  private generateCustomers(count: number) {
    const customers = []
    const industries = ['互联网', '金融', '教育', '医疗', '制造业']

    for (let i = 0; i < count; i++) {
      customers.push({
        id: i + 1,
        name: `客户${i + 1}公司`,
        contact: `联系人${i + 1}`,
        phone: `139${String(i).padStart(8, '0')}`,
        email: `customer${i + 1}@example.com`,
        industry: industries[i % industries.length],
        address: `北京市朝阳区某某街道${i + 1}号`,
        level: Math.floor(Math.random() * 5) + 1,
        status: i % 10 !== 0 ? 'active' : 'inactive',
        createTime: formatDate(new Date(Date.now() - i * 86400000))
      })
    }

    return customers
  }

  /**
   * 生成统计数据
   */
  generateStatistics() {
    const orders = this.data.get('order') || []
    const products = this.data.get('product') || []
    const customers = this.data.get('customer') || []

    return {
      today: {
        orderCount: Math.floor(Math.random() * 50) + 10,
        orderAmount: Math.floor(Math.random() * 50000) + 10000,
        customerCount: Math.floor(Math.random() * 10) + 1
      },
      week: {
        orderCount: Math.floor(Math.random() * 300) + 100,
        orderAmount: Math.floor(Math.random() * 300000) + 100000,
        customerCount: Math.floor(Math.random() * 50) + 20
      },
      month: {
        orderCount: Math.floor(Math.random() * 1000) + 500,
        orderAmount: Math.floor(Math.random() * 1000000) + 500000,
        customerCount: Math.floor(Math.random() * 200) + 100
      },
      total: {
        orderCount: orders.length,
        productCount: products.length,
        customerCount: customers.length
      }
    }
  }

  /**
   * 获取数据
   */
  getData<T = any>(type: MockDataType): T[] {
    return this.data.get(type) || []
  }

  /**
   * 根据 ID 获取数据
   */
  getDataById<T = any>(type: MockDataType, id: number): T | null {
    const list = this.getData<T>(type)
    return list.find((item) => item.id === id) || null
  }

  /**
   * 分页获取数据
   */
  getDataByPage<T = any>(
    type: MockDataType,
    page: number = 1,
    pageSize: number = 20,
    filters?: Record<string, any>
  ): { list: T[]; total: number } {
    let data = this.getData<T>(type)

    // 过滤
    if (filters) {
      data = this.filterData(data, filters)
    }

    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = data.slice(start, end)

    return {
      list,
      total: data.length
    }
  }

  /**
   * 过滤数据
   */
  private filterData<T = any>(data: T[], filters: Record<string, any>): T[] {
    return data.filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]
        const itemValue = (item as any)[key]

        if (filterValue === undefined || filterValue === null) {
          return true
        }

        if (typeof filterValue === 'string' && filterValue) {
          return String(itemValue).includes(filterValue)
        }

        return itemValue === filterValue
      })
    })
  }

  /**
   * 添加数据
   */
  addData<T = any>(type: MockDataType, data: T): T {
    const list = this.getData<T>(type)
    const newItem = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((item) => (item as any).id || 0)) + 1 : 1,
      createTime: formatDate(new Date())
    }

    list.push(newItem)
    this.saveToStorage()

    return newItem
  }

  /**
   * 更新数据
   */
  updateData<T = any>(type: MockDataType, id: number, data: Partial<T>): boolean {
    const list = this.getData<T>(type)
    const index = list.findIndex((item) => (item as any).id === id)

    if (index !== -1) {
      (list as any)[index] = {
        ...list[index],
        ...data,
        updateTime: formatDate(new Date())
      }
      this.saveToStorage()
      return true
    }

    return false
  }

  /**
   * 删除数据
   */
  deleteData(type: MockDataType, id: number): boolean {
    const list = this.getData(type)
    const index = list.findIndex((item) => (item as any).id === id)

    if (index !== -1) {
      list.splice(index, 1)
      this.saveToStorage()
      return true
    }

    return false
  }

  /**
   * 保存到本地存储
   */
  async saveToStorage() {
    try {
      const dataObj: Record<string, any[]> = {}
      this.data.forEach((value, key) => {
        dataObj[key] = value
      })

      await Storage.set('mock_data', dataObj)
      console.log('[Mock] 数据已保存到本地存储')
    } catch (error) {
      console.error('[Mock] 保存数据失败:', error)
    }
  }

  /**
   * 从本地存储加载
   */
  async loadFromStorage() {
    try {
      const dataObj = await Storage.get<Record<string, any[]>>('mock_data')
      if (dataObj) {
        Object.keys(dataObj).forEach((key) => {
          this.data.set(key as MockDataType, dataObj[key])
        })
        console.log('[Mock] 数据已从本地存储加载')
      }
    } catch (error) {
      console.error('[Mock] 加载数据失败:', error)
    }
  }

  /**
   * 清空所有数据
   */
  async clear() {
    this.data.clear()
    await Storage.remove('mock_data')
    console.log('[Mock] 所有数据已清空')
  }

  /**
   * 重置数据
   */
  async reset() {
    await this.clear()
    this.generateInitialData()
    await this.saveToStorage()
    console.log('[Mock] 数据已重置')
  }

  /**
   * 启用/禁用 Mock
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    console.log(`[Mock] Mock 已${enabled ? '启用' : '禁用'}`)
  }

  /**
   * 检查是否启用
   */
  isEnabled(): boolean {
    return this.enabled
  }
}

// 创建单例
const mockDataManager = new MockDataManager()

export default mockDataManager
