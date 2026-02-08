/**
 * 模板分类假数据
 * 模拟从后端获取的分类数据
 */

import type { Category } from '@/types/template'

// 所有分类数据（包括有数据和无数据的）
export const allCategories: Category[] = [
  // 有数据的分类
  {
    id: 'ecommerce',
    name: '综合电商',
    icon: '🛒',
    level: 1,
    hasData: true,
    templateCount: 8,
    children: [
      { id: 'ecommerce-platform', name: '电商平台', hasData: true, templateCount: 5 },
      { id: 'cross-border', name: '跨境电商', hasData: true, templateCount: 3 },
      { id: 'live-commerce', name: '直播带货', hasData: false, templateCount: 0 }
    ]
  },
  {
    id: 'entertainment',
    name: '娱乐',
    icon: '🎮',
    level: 1,
    hasData: true,
    templateCount: 2,
    children: [
      { id: 'video-entertainment', name: '视频娱乐', hasData: true, templateCount: 2 },
      { id: 'live-platform', name: '直播平台', hasData: false, templateCount: 0 }
    ]
  },
  {
    id: 'it-tech',
    name: 'IT科技',
    icon: '💻',
    level: 1,
    hasData: true,
    templateCount: 6,
    children: [
      { id: 'software-service', name: '软件服务', hasData: true, templateCount: 4 },
      { id: 'website-service', name: '网站服务', hasData: true, templateCount: 2 }
    ]
  },

  // 没有数据的分类（后端会过滤掉这些，这里仅用于演示）
  {
    id: 'logistics',
    name: '物流服务',
    icon: '📦',
    level: 1,
    hasData: false,
    templateCount: 0,
    children: []
  },
  {
    id: 'education',
    name: '教育服务',
    icon: '📚',
    level: 1,
    hasData: false,
    templateCount: 0,
    children: []
  },
  {
    id: 'medical',
    name: '医疗',
    icon: '🏥',
    level: 1,
    hasData: false,
    templateCount: 0,
    children: []
  }
]

// 过滤出有数据的分类（模拟后端返回）
export const getValidCategories = (): Category[] => {
  return allCategories.filter(cat => cat.hasData)
}

// 获取所有一级分类（包括"全部"选项）
export const getPrimaryCategories = () => {
  const validCategories = getValidCategories()
  return [
    {
      id: 'all',
      name: '全部',
      icon: '📦',
      level: 1,
      hasData: true,
      templateCount: validCategories.reduce((sum, cat) => sum + (cat.templateCount || 0), 0)
    },
    ...validCategories
  ]
}

// 根据一级分类ID获取二级分类
export const getSecondaryCategories = (primaryId: string) => {
  if (primaryId === 'all') {
    // 全部分类时，返回所有有数据的二级分类
    const all: any[] = []
    getValidCategories().forEach(primary => {
      if (primary.children) {
        primary.children.forEach(child => {
          if (child.hasData) {
            all.push({
              ...child,
              parentId: primary.id,
              parentName: primary.name
            })
          }
        })
      }
    })
    return all
  }

  const primary = allCategories.find(cat => cat.id === primaryId)
  return primary?.children?.filter(child => child.hasData) || []
}
