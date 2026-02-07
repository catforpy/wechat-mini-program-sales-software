<template>
  <view :class="['x-input', { 'x-input--disabled': disabled, 'x-input--error': error }]">
    <text v-if="label" class="x-input__label">{{ label }}</text>
    <input
      :class="['x-input__field']"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
    />
    <text v-if="clearable && modelValue && !disabled" class="x-input__clear" @click="handleClear">×</text>
    <slot name="suffix" />
  </view>
</template>

<script setup lang="ts">
/**
 * 基础输入框组件
 */
interface Props {
  modelValue: string | number
  type?: 'text' | 'number' | 'password' | 'digit'
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: boolean
  clearable?: boolean
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '请输入',
  disabled: false,
  error: false,
  clearable: false,
  maxlength: 140
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: []
  blur: []
  confirm: []
}>()

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value)
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleClear = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.x-input {
  display: flex;
  align-items: center;
  padding: $spacing-md;
  background-color: $bg-color-white;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  transition: $transition-base;

  &--disabled {
    background-color: $bg-color-disabled;
    cursor: not-allowed;
  }

  &--error {
    border-color: $danger-color;
  }

  &__label {
    flex-shrink: 0;
    margin-right: $spacing-md;
    font-size: $font-size-base;
    color: $text-color;
  }

  &__field {
    flex: 1;
    font-size: $font-size-base;
    color: $text-color;

    &::placeholder {
      color: $text-color-placeholder;
    }
  }

  &__clear {
    margin-left: $spacing-sm;
    font-size: $font-size-xl;
    color: $text-color-placeholder;
    cursor: pointer;
  }
}
</style>
