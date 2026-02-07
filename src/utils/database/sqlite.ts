/**
 * SQLite 数据库管理器
 * 适用于 App 端（Android/iOS）
 * 提供面向对象的数据库操作接口
 */

import type { DatabaseConfig, TableConfig, QueryCondition } from '@/types'
import { isApp } from '@/config/env'

/**
 * 数据库管理类
 */
class DatabaseManager {
  private db: any = null
  private config: DatabaseConfig | null = null
  private isOpen = false

  /**
   * 打开数据库
   */
  async open(config: DatabaseConfig): Promise<boolean> {
    // #ifndef APP-PLUS
    console.warn('[Database] SQLite 仅支持 App 端')
    return false
    // #endif

    // #ifdef APP-PLUS
    try {
      this.config = config

      // 打开数据库
      this.db = plus.sqlite.openDatabase({
        name: config.name,
        path: `_doc/${config.name}.db`
      })

      this.isOpen = true

      // 检查版本，执行迁移
      await this.checkVersion()

      console.log(`[Database] 数据库 ${config.name} 已打开`)

      return true
    } catch (error) {
      console.error('[Database] 打开数据库失败:', error)
      return false
    }
    // #endif
  }

  /**
   * 关闭数据库
   */
  async close(): Promise<void> {
    if (!this.isOpen || !this.db) {
      return
    }

    // #ifdef APP-PLUS
    try {
      plus.sqlite.closeDatabase(this.db)
      this.isOpen = false
      this.db = null
      console.log('[Database] 数据库已关闭')
    } catch (error) {
      console.error('[Database] 关闭数据库失败:', error)
    }
    // #endif
  }

  /**
   * 检查版本并执行迁移
   */
  private async checkVersion(): Promise<void> {
    // TODO: 实现版本检查和迁移逻辑
    const currentVersion = await this.getVersion()

    if (currentVersion < (this.config?.version || 1)) {
      await this.createTables()
      await this.setVersion(this.config?.version || 1)
    }
  }

  /**
   * 创建表
   */
  private async createTables(): Promise<void> {
    if (!this.config?.tables) {
      return
    }

    for (const tableConfig of this.config.tables) {
      await this.createTable(tableConfig)
    }
  }

  /**
   * 创建单个表
   */
  async createTable(tableConfig: TableConfig): Promise<boolean> {
    // #ifndef APP-PLUS
    return false
    // #endif

    // #ifdef APP-PLUS
    try {
      const columns = tableConfig.columns
        .map((col) => {
          let columnDef = `${col.name} ${col.type}`

          if (col.primaryKey) {
            columnDef += ' PRIMARY KEY'
          }
          if (col.autoIncrement) {
            columnDef += ' AUTOINCREMENT'
          }
          if (col.notNull) {
            columnDef += ' NOT NULL'
          }
          if (col.unique) {
            columnDef += ' UNIQUE'
          }
          if (col.defaultValue !== undefined) {
            columnDef += ` DEFAULT ${this.formatValue(col.defaultValue)}`
          }

          return columnDef
        })
        .join(', ')

      const sql = `CREATE TABLE IF NOT EXISTS ${tableConfig.name} (${columns})`

      await this.execute(sql)

      // 创建索引
      if (tableConfig.indexes) {
        for (const index of tableConfig.indexes) {
          await this.createIndex(tableConfig.name, index)
        }
      }

      console.log(`[Database] 表 ${tableConfig.name} 已创建`)

      return true
    } catch (error) {
      console.error(`[Database] 创建表失败:`, error)
      return false
    }
    // #endif
  }

  /**
   * 创建索引
   */
  async createIndex(tableName: string, index: any): Promise<boolean> {
    // #ifndef APP-PLUS
    return false
    // #endif

    // #ifdef APP-PLUS
    try {
      const unique = index.unique ? 'UNIQUE ' : ''
      const columns = index.columns.join(', ')
      const sql = `CREATE ${unique}INDEX IF NOT EXISTS ${index.name} ON ${tableName} (${columns})`

      await this.execute(sql)

      return true
    } catch (error) {
      console.error('[Database] 创建索引失败:', error)
      return false
    }
    // #endif
  }

  /**
   * 执行 SQL 语句（INSERT/UPDATE/DELETE）
   */
  async execute(sql: string, params: any[] = []): Promise<boolean> {
    if (!this.isOpen) {
      console.error('[Database] 数据库未打开')
      return false
    }

    // #ifndef APP-PLUS
    return false
    // #endif

    // #ifdef APP-PLUS
    try {
      plus.sqlite.executeSql(this.db, sql, params)
      return true
    } catch (error) {
      console.error('[Database] 执行 SQL 失败:', sql, error)
      return false
    }
    // #endif
  }

  /**
   * 查询数据
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.isOpen) {
      console.error('[Database] 数据库未打开')
      return []
    }

    // #ifndef APP-PLUS
    return []
    // #endif

    // #ifdef APP-PLUS
    try {
      const data = plus.sqlite.selectSql(this.db, sql, params)
      return data as T[]
    } catch (error) {
      console.error('[Database] 查询失败:', sql, error)
      return []
    }
    // #endif
  }

  /**
   * 插入数据
   */
  async insert(table: string, data: Record<string, any>): Promise<boolean> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => '?').join(', ')

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`

    return await this.execute(sql, values)
  }

  /**
   * 批量插入数据
   */
  async batchInsert(
    table: string,
    dataList: Record<string, any>[]
  ): Promise<boolean> {
    // #ifndef APP-PLUS
    return false
    // #endif

    // #ifdef APP-PLUS
    try {
      // 开启事务
      await this.execute('BEGIN TRANSACTION')

      for (const data of dataList) {
        const success = await this.insert(table, data)
        if (!success) {
          throw new Error('批量插入失败')
        }
      }

      // 提交事务
      await this.execute('COMMIT')

      return true
    } catch (error) {
      // 回滚事务
      await this.execute('ROLLBACK')
      console.error('[Database] 批量插入失败:', error)
      return false
    }
    // #endif
  }

  /**
   * 更新数据
   */
  async update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<boolean> {
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ')
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(' AND ')
    const values = [...Object.values(data), ...Object.values(where)]

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`

    return await this.execute(sql, values)
  }

  /**
   * 删除数据
   */
  async delete(table: string, where: Record<string, any>): Promise<boolean> {
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(' AND ')
    const values = Object.values(where)

    const sql = `DELETE FROM ${table} WHERE ${whereClause}`

    return await this.execute(sql, values)
  }

  /**
   * 查询表数据（支持条件）
   */
  async select<T = any>(
    table: string,
    condition: QueryCondition = {}
  ): Promise<T[]> {
    let sql = `SELECT * FROM ${table}`
    const params: any[] = []

    if (condition.where) {
      const whereClause = Object.keys(condition.where)
        .map((key) => `${key} = ?`)
        .join(' AND ')
      sql += ` WHERE ${whereClause}`
      params.push(...Object.values(condition.where))
    }

    if (condition.orderBy) {
      sql += ` ORDER BY ${condition.orderBy}`
      if (condition.order) {
        sql += ` ${condition.order}`
      }
    }

    if (condition.limit) {
      sql += ` LIMIT ${condition.limit}`
    }

    if (condition.offset) {
      sql += ` OFFSET ${condition.offset}`
    }

    return await this.query<T>(sql, params)
  }

  /**
   * 统计记录数
   */
  async count(table: string, where?: Record<string, any>): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${table}`
    const params: any[] = []

    if (where) {
      const whereClause = Object.keys(where)
        .map((key) => `${key} = ?`)
        .join(' AND ')
      sql += ` WHERE ${whereClause}`
      params.push(...Object.values(where))
    }

    const result = await this.query<{ count: number }>(sql, params)
    return result[0]?.count || 0
  }

  /**
   * 判断数据是否存在
   */
  async exists(table: string, where: Record<string, any>): Promise<boolean> {
    const count = await this.count(table, where)
    return count > 0
  }

  /**
   * 清空表
   */
  async truncate(table: string): Promise<boolean> {
    return await this.execute(`DELETE FROM ${table}`)
  }

  /**
   * 删除表
   */
  async dropTable(table: string): Promise<boolean> {
    return await this.execute(`DROP TABLE IF EXISTS ${table}`)
  }

  /**
   * 获取数据库版本
   */
  async getVersion(): Promise<number> {
    // TODO: 从版本表中获取
    return 0
  }

  /**
   * 设置数据库版本
   */
  async setVersion(version: number): Promise<boolean> {
    // TODO: 保存到版本表
    return true
  }

  /**
   * 格式化值
   */
  private formatValue(value: any): string {
    if (typeof value === 'string') {
      return `'${value}'`
    }
    return String(value)
  }

  /**
   * 执行事务
   */
  async transaction(callback: () => Promise<void>): Promise<boolean> {
    // #ifndef APP-PLUS
    return false
    // #endif

    // #ifdef APP-PLUS
    try {
      await this.execute('BEGIN TRANSACTION')
      await callback()
      await this.execute('COMMIT')
      return true
    } catch (error) {
      await this.execute('ROLLBACK')
      console.error('[Database] 事务执行失败:', error)
      return false
    }
    // #endif
  }

  /**
   * 获取表列表
   */
  async getTables(): Promise<string[]> {
    // #ifndef APP-PLUS
    return []
    // #endif

    // #ifdef APP-PLUS
    const sql = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    const result = await this.query<{ name: string }>(sql)
    return result.map((item) => item.name)
    // #endif
  }

  /**
   * 获取表结构
   */
  async getTableSchema(table: string): Promise<any[]> {
    // #ifndef APP-PLUS
    return []
    // #endif

    // #ifdef APP-PLUS
    const sql = `PRAGMA table_info(${table})`
    return await this.query(sql)
    // #endif
  }

  /**
   * 导出数据库为 SQL
   */
  async exportSQL(): Promise<string> {
    // #ifndef APP-PLUS
    return ''
    // #endif

    // #ifdef APP-PLUS
    const tables = await this.getTables()
    let sql = ''

    for (const table of tables) {
      // 导出表结构
      const schema = await this.getTableSchema(table)
      sql += `-- Table: ${table}\n`
      // TODO: 生成完整的 CREATE TABLE 语句

      // 导出数据
      const data = await this.query(`SELECT * FROM ${table}`)
      for (const row of data) {
        const values = Object.values(row).map((v) => this.formatValue(v)).join(', ')
        sql += `INSERT INTO ${table} VALUES (${values});\n`
      }

      sql += '\n'
    }

    return sql
    // #endif
  }
}

/**
 * 全局数据库实例
 */
export const database = new DatabaseManager()

export default DatabaseManager
