/**
 * 模板列表假数据
 * 模拟从后端获取的模板列表
 */

import type { Template } from '@/types/template'

// 所有模板数据
export const allTemplates: Template[] = [
  // ============ 综合电商 > 电商平台 ============
  {
    id: 1,
    name: '电商商城模板',
    categoryId: 'ecommerce-platform',
    categoryPath: '综合电商 > 电商平台',
    price: 1798,
    rating: 4.9,
    salesCount: 25,
    thumbnail: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=电商商城',
    tags: ['商品管理', '支付系统', '会员管理'],
    agentName: '小张',
    agentId: 1,
    updatedAt: '2天前'
  },
  {
    id: 2,
    name: 'B2C电商系统',
    categoryId: 'ecommerce-platform',
    categoryPath: '综合电商 > 电商平台',
    price: 2798,
    rating: 4.8,
    salesCount: 18,
    thumbnail: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=B2C电商',
    tags: ['在线支付', '订单管理', '营销活动'],
    agentName: '小李',
    agentId: 2,
    updatedAt: '1天前'
  },
  {
    id: 3,
    name: '多商户商城',
    categoryId: 'ecommerce-platform',
    categoryPath: '综合电商 > 电商平台',
    price: 3298,
    rating: 4.7,
    salesCount: 12,
    thumbnail: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=多商户',
    tags: ['多商户入驻', '分账系统', '数据统计'],
    agentName: '小张',
    agentId: 1,
    updatedAt: '3天前'
  },
  {
    id: 4,
    name: '社区团购系统',
    categoryId: 'ecommerce-platform',
    categoryPath: '综合电商 > 电商平台',
    price: 2298,
    rating: 4.6,
    salesCount: 15,
    thumbnail: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=社区团购',
    tags: ['团长管理', '自提点', '配送管理'],
    agentName: '小孙',
    agentId: 3,
    updatedAt: '5天前'
  },
  {
    id: 5,
    name: '生鲜电商模板',
    categoryId: 'ecommerce-platform',
    categoryPath: '综合电商 > 电商平台',
    price: 1998,
    rating: 4.8,
    salesCount: 20,
    thumbnail: 'https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=生鲜电商',
    tags: ['冷链管理', '配送预约', '品质保证'],
    agentName: '小李',
    agentId: 2,
    updatedAt: '1周前'
  },

  // ============ 综合电商 > 跨境电商 ============
  {
    id: 6,
    name: '跨境电商平台',
    categoryId: 'cross-border',
    categoryPath: '综合电商 > 跨境电商',
    price: 3998,
    rating: 4.9,
    salesCount: 8,
    thumbnail: 'https://via.placeholder.com/300x200/E91E63/FFFFFF?text=跨境电商',
    tags: ['多语言', '汇率换算', '国际物流'],
    agentName: '小张',
    agentId: 1,
    updatedAt: '2天前'
  },
  {
    id: 7,
    name: '海外代购系统',
    categoryId: 'cross-border',
    categoryPath: '综合电商 > 跨境电商',
    price: 3498,
    rating: 4.7,
    salesCount: 6,
    thumbnail: 'https://via.placeholder.com/300x200/3F51B5/FFFFFF?text=海外代购',
    tags: ['保税仓', '清关服务', '正品保障'],
    agentName: '小李',
    agentId: 2,
    updatedAt: '4天前'
  },
  {
    id: 8,
    name: '进口商品商城',
    categoryId: 'cross-border',
    categoryPath: '综合电商 > 跨境电商',
    price: 2998,
    rating: 4.6,
    salesCount: 10,
    thumbnail: 'https://via.placeholder.com/300x200/009688/FFFFFF?text=进口商品',
    tags: ['原产地直采', '溯源系统', '会员专享'],
    agentName: '小孙',
    agentId: 3,
    updatedAt: '1周前'
  },

  // ============ 娱乐 > 视频娱乐 ============
  {
    id: 9,
    name: '短视频平台',
    categoryId: 'video-entertainment',
    categoryPath: '娱乐 > 视频娱乐',
    price: 4998,
    rating: 4.8,
    salesCount: 14,
    thumbnail: 'https://via.placeholder.com/300x200/F44336/FFFFFF?text=短视频',
    tags: ['视频上传', '点赞评论', '推荐算法'],
    agentName: '小张',
    agentId: 1,
    updatedAt: '3天前'
  },
  {
    id: 10,
    name: '在线影院系统',
    categoryId: 'video-entertainment',
    categoryPath: '娱乐 > 视频娱乐',
    price: 4298,
    rating: 4.7,
    salesCount: 9,
    thumbnail: 'https://via.placeholder.com/300x200/673AB7/FFFFFF?text=在线影院',
    tags: ['VIP会员', '在线播放', '片源管理'],
    agentName: '小李',
    agentId: 2,
    updatedAt: '5天前'
  },

  // ============ IT科技 > 软件服务 ============
  {
    id: 11,
    name: 'SaaS管理平台',
    categoryId: 'software-service',
    categoryPath: 'IT科技 > 软件服务',
    price: 5998,
    rating: 4.9,
    salesCount: 11,
    thumbnail: 'https://via.placeholder.com/300x200/607D8B/FFFFFF?text=SaaS平台',
    tags: ['多租户', '权限管理', '数据分析'],
    agentName: '小张',
    agentId: 1,
    updatedAt: '1天前'
  },
  {
    id: 12,
    name: 'CRM客户管理系统',
    categoryId: 'software-service',
    categoryPath: 'IT科技 > 软件服务',
    price: 3298,
    rating: 4.8,
    salesCount: 16,
    thumbnail: 'https://via.placeholder.com/300x200/795548/FFFFFF?text=CRM系统',
    tags: ['客户管理', '销售漏斗', '跟进提醒'],
    agentName: '小李',
    agentId: 2,
    updatedAt: '2天前'
  },
  {
    id: 13,
    name: '项目管理工具',
    categoryId: 'software-service',
    categoryPath: 'IT科技 > 软件服务',
    price: 2798,
    rating: 4.7,
    salesCount: 13,
    thumbnail: 'https://via.placeholder.com/300x200/9E9E9E/FFFFFF?text=项目管理',
    tags: ['任务管理', '团队协作', '进度跟踪'],
    agentName: '小孙',
    agentId: 3,
    updatedAt: '4天前'
  },
  {
    id: 14,
    name: '在线办公系统',
    categoryId: 'software-service',
    categoryPath: 'IT科技 > 软件服务',
    price: 3798,
    rating: 4.6,
    salesCount: 7,
    thumbnail: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=在线办公',
    tags: ['考勤管理', '审批流程', '文档协作'],
    agentName: '小张',
    agentId: 1,
    updatedAt: '6天前'
  },

  // ============ IT科技 > 网站服务 ============
  {
    id: 15,
    name: '企业官网模板',
    categoryId: 'website-service',
    categoryPath: 'IT科技 > 网站服务',
    price: 1298,
    rating: 4.9,
    salesCount: 28,
    thumbnail: 'https://via.placeholder.com/300x200/1E88E5/FFFFFF?text=企业官网',
    tags: ['响应式设计', 'SEO优化', '多语言'],
    agentName: '小李',
    agentId: 2,
    updatedAt: '1天前'
  },
  {
    id: 16,
    name: '品牌展示网站',
    categoryId: 'website-service',
    categoryPath: 'IT科技 > 网站服务',
    price: 1598,
    rating: 4.8,
    salesCount: 22,
    thumbnail: 'https://via.placeholder.com/300x200/43A047/FFFFFF?text=品牌展示',
    tags: ['视觉设计', '动画效果', '案例展示'],
    agentName: '小孙',
    agentId: 3,
    updatedAt: '3天前'
  }
]

/**
 * 根据筛选条件获取模板列表
 * 模拟后端接口
 */
export const getTemplates = (params: {
  categoryId?: string
  keyword?: string
  page?: number
  pageSize?: number
  sortBy?: 'price' | 'rating' | 'sales' | 'newest'
}) => {
  const { categoryId = 'all', keyword = '', page = 1, pageSize = 20, sortBy } = params

  // 1. 根据分类ID筛选
  let filtered = allTemplates
  if (categoryId !== 'all') {
    filtered = allTemplates.filter(t => t.categoryId === categoryId)
  }

  // 2. 根据关键词搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
      t.categoryPath.toLowerCase().includes(lowerKeyword)
    )
  }

  // 3. 排序
  if (sortBy) {
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'sales':
        filtered.sort((a, b) => b.salesCount - a.salesCount)
        break
      case 'newest':
        // 这里简化处理，实际应该根据 updatedAt 排序
        filtered.sort((a, b) => b.id - a.id)
        break
    }
  }

  // 4. 分页
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const templates = filtered.slice(start, end)

  return {
    templates,
    total,
    page,
    pageSize,
    hasMore: end < total
  }
}

/**
 * 根据ID获取单个模板详情
 */
export const getTemplateById = (id: number) => {
  return allTemplates.find(t => t.id === id)
}
