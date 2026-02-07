/**
 * 格式化工具函数
 * 处理日期、数字、文件大小等格式化
 */

import { DATE_FORMAT, FILE_SIZE_UNITS } from '@/config/constant'

/**
 * 格式化日期时间
 */
export function formatDate(
  date: string | number | Date,
  format: string = DATE_FORMAT.DATETIME
): string {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  const milliseconds = String(d.getMilliseconds()).padStart(3, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds)
}

/**
 * 格式化相对时间（多久之前）
 */
export function formatRelativeTime(date: string | number | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return `${years}年前`
  }
  if (months > 0) {
    return `${months}个月前`
  }
  if (days > 0) {
    return `${days}天前`
  }
  if (hours > 0) {
    return `${hours}小时前`
  }
  if (minutes > 0) {
    return `${minutes}分钟前`
  }
  if (seconds > 0) {
    return `${seconds}秒前`
  }
  return '刚刚'
}

/**
 * 格式化数字（千分位）
 */
export function formatNumber(num: number, decimals = 2): string {
  if (isNaN(num)) {
    return '0'
  }

  const parts = num.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return parts.join('.')
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency = '¥',
  decimals = 2
): string {
  return `${currency}${formatNumber(amount, decimals)}`
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals = 2): string {
  if (isNaN(value)) {
    return '0%'
  }

  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }

  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)

  return `${size.toFixed(i === 0 ? 0 : 2)} ${FILE_SIZE_UNITS[i]}`
}

/**
 * 格式化手机号（隐藏中间4位）
 */
export function formatPhone(phone: string): string {
  if (!phone) {
    return ''
  }

  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化身份证号（隐藏中间部分）
 */
export function formatIdCard(idCard: string): string {
  if (!idCard || idCard.length < 18) {
    return ''
  }

  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
}

/**
 * 格式化银行卡号（每4位一组）
 */
export function formatBankCard(cardNo: string): string {
  if (!cardNo) {
    return ''
  }

  return cardNo.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
}

/**
 * 格式化姓名（隐藏中间部分）
 */
export function formatName(name: string): string {
  if (!name) {
    return ''
  }

  if (name.length === 2) {
    return name[0] + '*'
  }

  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}

/**
 * 格式化时长（秒 -> HH:mm:ss）
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) {
    return '00:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(secs).padStart(2, '0')

  return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`
}

/**
 * 格式化距离（米 -> 千米/米）
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}米`
  }

  return `${(meters / 1000).toFixed(1)}公里`
}

/**
 * 截断文本（超长显示省略号）
 */
export function truncate(text: string, maxLength = 50, suffix = '...'): string {
  if (!text || text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength) + suffix
}

/**
 * 高亮关键词
 */
export function highlightKeyword(text: string, keyword: string): string {
  if (!text || !keyword) {
    return text
  }

  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

/**
 * 清除 HTML 标签
 */
export function stripHtml(html: string): string {
  if (!html) {
    return ''
  }

  return html.replace(/<[^>]*>/g, '')
}

/**
 * 转义 HTML
 */
export function escapeHtml(text: string): string {
  if (!text) {
    return ''
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }

  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * 生成随机字符串
 */
export function randomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

/**
 * 生成 UUID
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 数字转中文
 */
export function numberToChinese(num: number): string {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿']

  if (num === 0) {
    return digits[0]
  }

  let result = ''
  let unitIndex = 0

  while (num > 0) {
    const digit = num % 10
    if (digit !== 0) {
      result = digits[digit] + units[unitIndex] + result
    } else if (result && !result.startsWith(digits[0])) {
      result = digits[0] + result
    }
    num = Math.floor(num / 10)
    unitIndex++
  }

  // 处理"一十"的特殊情况
  if (result.startsWith('一十')) {
    result = result.substring(1)
  }

  return result
}
