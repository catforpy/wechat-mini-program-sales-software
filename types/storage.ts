/**
 * 存储相关类型定义
 */

/**
 * 存储类型
 */
export type StorageType = 'local' | 'session' | 'memory'

/**
 * 存储选项
 */
export interface StorageOptions {
  type?: StorageType
  expire?: number // 过期时间(毫秒)
  encrypt?: boolean // 是否加密
}

/**
 * 数据库配置
 */
export interface DatabaseConfig {
  name: string
  version: number
  tables: TableConfig[]
}

/**
 * 表配置
 */
export interface TableConfig {
  name: string
  columns: ColumnConfig[]
  indexes?: IndexConfig[]
}

/**
 * 列配置
 */
export interface ColumnConfig {
  name: string
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB'
  primaryKey?: boolean
  autoIncrement?: boolean
  notNull?: boolean
  unique?: boolean
  defaultValue?: any
}

/**
 * 索引配置
 */
export interface IndexConfig {
  name: string
  columns: string[]
  unique?: boolean
}

/**
 * 查询条件
 */
export interface QueryCondition {
  where?: Record<string, any>
  orderBy?: string
  order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
}
