<template>
  <view class="tencent-live-pusher-wrapper">
    <text class="tip">腾讯云直播推流</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  url: string
  autoplay?: boolean
  muted?: boolean
  cameraPosition?: 'front' | 'back'
  beauty?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  muted: false,
  cameraPosition: 'front',
  beauty: 5
})

const emit = defineEmits(['statechange', 'error'])
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.tencent-live-pusher-wrapper {
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
