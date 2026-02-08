<template>
  <view class="tencent-live-player-wrapper">
    <text class="tip">腾讯云直播播放器</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  src: string
  autoplay?: boolean
  muted?: boolean
  orientation?: 'vertical' | 'horizontal'
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  muted: false,
  orientation: 'vertical',
  showProgress: true
})

const emit = defineEmits(['play', 'pause', 'ended', 'error'])
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.tencent-live-player-wrapper {
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
