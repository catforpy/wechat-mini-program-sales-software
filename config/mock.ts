/**
 * Mock 配置
 * 控制是否使用 Mock 数据
 */

import { isDev } from './env'

/**
 * Mock 配置
 */
export const mockConfig = {
  // 是否启用 Mock（开发环境默认启用）
  enabled: isDev(),

  // 模拟网络延迟（毫秒）
  delay: 300,

  // 错误率（0-1，用于测试错误处理）
  errorRate: 0,

  // 是否显示日志
  showLog: true
}

/**
 * 设置是否启用 Mock
 */
export function setMockEnabled(enabled: boolean) {
  mockConfig.enabled = enabled
  console.log(`[Mock] 已${enabled ? '启用' : '禁用'} Mock 数据`)
}

/**
 * 设置 Mock 延迟
 */
export function setMockDelay(delay: number) {
  mockConfig.delay = delay
}

/**
 * 设置错误率
 */
export function setMockErrorRate(rate: number) {
  mockConfig.errorRate = rate
}

/**
 * 检查是否启用 Mock
 */
export function isMockEnabled(): boolean {
  return mockConfig.enabled
}

/**
 * Mock 日志
 */
export function mockLog(...args: any[]) {
  if (mockConfig.showLog) {
    console.log('[Mock]', ...args)
  }
}
