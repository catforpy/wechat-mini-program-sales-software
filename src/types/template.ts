/**
 * 模板中心相关类型定义
 */

// 用户角色枚举
export enum UserRole {
  AGENT = 'agent',         // 代理商
  MERCHANT = 'merchant',   // 商户
  ADMIN = 'admin'          // 管理员
}

// 分类接口
export interface Category {
  id: string
  name: string
  icon?: string
  level: 1 | 2
  hasData: boolean          // 是否有模板数据
  templateCount?: number    // 该分类下模板数量
  children?: SecondaryCategory[]
}

// 二级分类
export interface SecondaryCategory {
  id: string
  name: string
  hasData: boolean
  templateCount?: number
}

// 模板接口
export interface Template {
  id: number
  name: string
  categoryId: string        // 二级分类ID
  categoryPath: string      // 完整分类路径，如 "综合电商 > 电商平台"
  price: number
  rating: number
  salesCount: number
  thumbnail: string
  tags: string[]
  agentName?: string        // 代理商名称（商户端显示）
  agentId?: number
  isCollected?: boolean     // 是否已收藏（商户端）
  updatedAt?: string
}

// 模板列表响应
export interface TemplateListResponse {
  templates: Template[]
  total: number
  page: number
  pageSize: number
}

// 分类列表响应
export interface CategoryListResponse {
  categories: Category[]
}

// 模板筛选参数
export interface TemplateFilter {
  categoryId?: string       // 分类ID，不传则查询全部
  keyword?: string          // 搜索关键词
  page?: number
  pageSize?: number
  sortBy?: 'price' | 'rating' | 'sales' | 'newest'  // 排序方式
}
