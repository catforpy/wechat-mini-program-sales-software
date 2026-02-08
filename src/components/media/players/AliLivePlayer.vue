<template>
  <view class="ali-live-player-wrapper">
    <text class="tip">阿里云直播播放器</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  src: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false
})

const emit = defineEmits(['play', 'pause', 'error'])
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ali-live-player-wrapper {
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
