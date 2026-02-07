/**
 * 表单相关的 Composable
 */
import { ref, reactive, computed } from 'vue'
import { isPhone, isEmail, isPassword } from '@/utils'

export interface FormRule {
  required?: boolean
  message?: string
  validator?: (value: any) => boolean | string
}

export interface FormRules {
  [key: string]: FormRule[]
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  rules?: FormRules
) {
  // 表单数据
  const formData = reactive<T>({ ...initialValues })

  // 错误信息
  const errors = reactive<Record<string, string>>({})

  // 是否正在提交
  const submitting = ref(false)

  /**
   * 设置字段值
   */
  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    formData[field] = value
    delete errors[field as string]
  }

  /**
   * 获取字段值
   */
  const getFieldValue = <K extends keyof T>(field: K): T[K] => {
    return formData[field]
  }

  /**
   * 验证单个字段
   */
  const validateField = (field: string): boolean => {
    if (!rules || !rules[field]) {
      return true
    }

    const value = formData[field]
    const fieldRules = rules[field]

    for (const rule of fieldRules) {
      // 必填验证
      if (rule.required && !value) {
        errors[field] = rule.message || '该字段为必填项'
        return false
      }

      // 自定义验证
      if (rule.validator) {
        const result = rule.validator(value)
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : rule.message || '验证失败'
          return false
        }
      }
    }

    delete errors[field]
    return true
  }

  /**
   * 验证整个表单
   */
  const validate = (): boolean => {
    if (!rules) return true

    let valid = true
    for (const field in rules) {
      if (!validateField(field)) {
        valid = false
      }
    }
    return valid
  }

  /**
   * 重置表单
   */
  const reset = () => {
    Object.assign(formData, initialValues)
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  /**
   * 清空错误
   */
  const clearErrors = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  /**
   * 提交表单
   */
  const handleSubmit = async (fn: (data: T) => Promise<any>) => {
    if (!validate()) {
      return false
    }

    submitting.value = true
    try {
      await fn(formData)
      return true
    } catch (error) {
      console.error('[useForm] 提交失败:', error)
      return false
    } finally {
      submitting.value = false
    }
  }

  return {
    formData,
    errors: computed(() => errors),
    submitting: computed(() => submitting.value),
    setFieldValue,
    getFieldValue,
    validateField,
    validate,
    reset,
    clearErrors,
    handleSubmit
  }
}

/**
 * 常用验证规则
 */
export const formRules = {
  // 必填
  required: (message = '该字段为必填项'): FormRule => ({
    required: true,
    message
  }),

  // 手机号
  phone: (message = '请输入正确的手机号'): FormRule => ({
    validator: (value: string) => isPhone(value) || message
  }),

  // 邮箱
  email: (message = '请输入正确的邮箱'): FormRule => ({
    validator: (value: string) => isEmail(value) || message
  }),

  // 密码
  password: (message = '密码为8-20位，包含字母和数字'): FormRule => ({
    validator: (value: string) => isPassword(value) || message
  }),

  // 最小长度
  minLength: (min: number, message?: string): FormRule => ({
    validator: (value: string) => value.length >= min || (message || `长度不能少于${min}位`)
  }),

  // 最大长度
  maxLength: (max: number, message?: string): FormRule => ({
    validator: (value: string) => value.length <= max || (message || `长度不能超过${max}位`)
  })
}
