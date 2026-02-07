/**
 * 数据库模块统一导出
 */

export { default as DatabaseManager, database } from './sqlite'
export type { DatabaseConfig, TableConfig, QueryCondition } from '@/types'
