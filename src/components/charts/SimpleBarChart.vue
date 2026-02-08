<template>
  <view class="chart-wrapper">
    <canvas
      :canvas-id="canvasId"
      :id="canvasId"
      class="chart-canvas"
      :style="{ width: width + 'px', height: height + 'px' }"
    ></canvas>
  </view>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

interface ChartData {
  date: string
  value: number
}

interface Props {
  canvasId: string
  data: ChartData[]
  width?: number
  height?: number
  title?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 335,
  height: 200,
  color: '#667eea'
})

onMounted(() => {
  drawChart()
})

watch(() => props.data, () => {
  drawChart()
}, { deep: true })

const drawChart = () => {
  const ctx = uni.createCanvasContext(props.canvasId)
  ctx.canvas = {
    width: props.width,
    height: props.height
  }

  const { data, width, height, color } = props
  const padding = { top: 30, right: 30, bottom: 40, left: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 找出最大值
  const maxValue = Math.max(...data.map(d => d.value))
  const yAxisMax = Math.ceil(maxValue * 1.1)

  // 绘制网格线
  ctx.setStrokeStyle('#e5e5e5')
  ctx.setLineWidth(1)
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(width - padding.right, y)
    ctx.stroke()

    // Y轴标签
    const value = yAxisMax - (yAxisMax / 4) * i
    ctx.fillStyle = '#999999'
    ctx.font = '10px Arial'
    ctx.fillText(formatValue(value), 5, y + 4)
  }

  // 计算柱子宽度和间距
  const barWidth = (chartWidth / data.length) * 0.5
  const barSpacing = (chartWidth / data.length)

  // 绘制柱状图
  data.forEach((item, index) => {
    const x = padding.left + barSpacing * index + (barSpacing - barWidth) / 2
    const barHeight = (item.value / yAxisMax) * chartHeight
    const y = padding.top + chartHeight - barHeight

    // 绘制柱子
    ctx.setFillStyle(color)
    ctx.fillRect(x, y, barWidth, barHeight)

    // X轴标签
    ctx.fillStyle = '#666666'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(item.date, x + barWidth / 2, height - padding.bottom + 20)
  })

  // 绘制
  ctx.draw()
}

const formatValue = (value: number) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + 'w'
  }
  return value.toString()
}
</script>

<style scoped>
.chart-wrapper {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
}

.chart-canvas {
  display: block;
}
</style>
