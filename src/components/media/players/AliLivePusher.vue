<template>
  <view class="ali-live-pusher-wrapper">
    <text class="tip">阿里云直播推流</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  url: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false
})

const emit = defineEmits(['statechange', 'error'])
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ali-live-pusher-wrapper {
  width: 100%;
  height: 100%;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;

  .tip {
    color: #ffffff;
    font-size: $font-size-sm;
  }
}
</style>
