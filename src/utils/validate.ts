/**
 * 验证工具函数
 * 各种数据验证规则
 */

import { REGEX } from '@/config/constant'

/**
 * 验证是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

/**
 * 验证手机号
 */
export function isPhone(phone: string): boolean {
  return REGEX.PHONE.test(phone)
}

/**
 * 验证邮箱
 */
export function isEmail(email: string): boolean {
  return REGEX.EMAIL.test(email)
}

/**
 * 验证身份证号
 */
export function isIdCard(idCard: string): boolean {
  return REGEX.ID_CARD.test(idCard)
}

/**
 * 验证 URL
 */
export function isUrl(url: string): boolean {
  return REGEX.URL.test(url)
}

/**
 * 验证 IP 地址
 */
export function isIp(ip: string): boolean {
  return REGEX.IP.test(ip)
}

/**
 * 验证密码强度
 * 8-20位，包含字母和数字
 */
export function isPassword(password: string): boolean {
  return REGEX.PASSWORD.test(password)
}

/**
 * 验证密码强度等级
 * 返回 0-4，0 表示最弱，4 表示最强
 */
export function getPasswordStrength(password: string): number {
  let strength = 0

  if (password.length >= 8) {
    strength++
  }
  if (password.length >= 12) {
    strength++
  }
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    strength++
  }
  if (/\d/.test(password)) {
    strength++
  }
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    strength++
  }

  return Math.min(strength, 4)
}

/**
 * 验证是否为数字
 */
export function isNumber(value: any): boolean {
  return !isNaN(value) && value !== null && value !== ''
}

/**
 * 验证是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(Number(value))
}

/**
 * 验证是否为正数
 */
export function isPositive(value: any): boolean {
  return isNumber(value) && Number(value) > 0
}

/**
 * 验证是否为负数
 */
export function isNegative(value: any): boolean {
  return isNumber(value) && Number(value) < 0
}

/**
 * 验证范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * 验证是否为日期
 */
export function isDate(value: any): boolean {
  return !isNaN(Date.parse(value))
}

/**
 * 验证是否为数组
 */
export function isArray(value: any): boolean {
  return Array.isArray(value)
}

/**
 * 验证是否为对象
 */
export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 验证是否为函数
 */
export function isFunction(value: any): boolean {
  return typeof value === 'function'
}

/**
 * 验证是否为 Promise
 */
export function isPromise(value: any): boolean {
  return value && typeof value.then === 'function'
}

/**
 * 验证银行卡号
 */
export function isBankCard(cardNo: string): boolean {
  // 银行卡号通常为 12-19 位数字
  return /^\d{12,19}$/.test(cardNo)
}

/**
 * 验证车牌号
 */
export function isLicensePlate(plate: string): boolean {
  // 普通车牌：京A12345
  const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{5}$/
  // 新能源车牌：京AD12345
  const newEnergyPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{5}[DF]$/

  return normalPlate.test(plate) || newEnergyPlate.test(plate)
}

/**
 * 验证中文姓名
 */
export function isChineseName(name: string): boolean {
  // 2-4 个汉字
  return /^[\u4e00-\u9fa5]{2,4}$/.test(name)
}

/**
 * 验证邮政编码
 */
export function isPostalCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}

/**
 * 验证 QQ 号
 */
export function isQQ(qq: string): boolean {
  return /^[1-9]\d{4,10}$/.test(qq)
}

/**
 * 验证微信号
 */
export function isWechatId(wechatId: string): boolean {
  // 微信号规则：6-20位，以字母开头，可包含字母、数字、下划线、减号
  return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(wechatId)
}

/**
 * 验证是否为国内手机号（包含运营商）
 */
export function getPhoneCarrier(phone: string): string | null {
  if (!isPhone(phone)) {
    return null
  }

  const prefix = phone.substring(0, 3)

  // 中国移动
  if (/^134[0-8]|^135|^136|^137|^138|^139|^150|^151|^152|^157|^158|^159|^182|^183|^184|^187|^188|^178|^198/.test(prefix)) {
    return '中国移动'
  }

  // 中国联通
  if (/^130|^131|^132|^155|^156|^185|^186|^166|^175|^176/.test(prefix)) {
    return '中国联通'
  }

  // 中国电信
  if (/^133|^153|^180|^181|^189|^177|^173|^199/.test(prefix)) {
    return '中国电信'
  }

  return '未知运营商'
}

/**
 * 验证身份证号并获取信息
 */
export function getIdCardInfo(idCard: string): {
  valid: boolean
  gender?: '男' | '女'
  birthDate?: string
  age?: number
} | null {
  if (!isIdCard(idCard)) {
    return { valid: false }
  }

  // 获取出生日期
  const birthDateStr = idCard.substring(6, 14)
  const birthDate = new Date(
    birthDateStr.substring(0, 4) +
      '-' +
      birthDateStr.substring(4, 6) +
      '-' +
      birthDateStr.substring(6, 8)
  )

  // 计算年龄
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  // 获取性别
  const genderCode = parseInt(idCard.substring(16, 17))
  const gender = genderCode % 2 === 1 ? '男' : '女'

  return {
    valid: true,
    gender,
    birthDate: birthDateStr.substring(0, 4) +
      '-' +
      birthDateStr.substring(4, 6) +
      '-' +
      birthDateStr.substring(6, 8),
    age
  }
}
