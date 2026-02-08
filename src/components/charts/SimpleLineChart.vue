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
  const padding = { top: 30, right: 30, bottom: 40, left: 40 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 找出最大值和最小值（用于Y轴）
  const values = data.map(d => d.value)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const valueRange = maxValue - minValue || 1

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
    const value = maxValue - (valueRange / 4) * i
    ctx.fillStyle = '#999999'
    ctx.font = '10px Arial'
    ctx.fillText(value.toFixed(0), 5, y + 4)
  }

  // 绘制折线
  ctx.setStrokeStyle(color)
  ctx.setLineWidth(2)
  ctx.beginPath()

  const points: any[] = []

  data.forEach((item, index) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * index
    const y = padding.top + chartHeight - ((item.value - minValue) / valueRange) * chartHeight

    points.push({ x, y })

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // 绘制数据点
  points.forEach(point => {
    ctx.setFillStyle('#ffffff')
    ctx.beginPath()
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
    ctx.fill()

    ctx.setStrokeStyle(color)
    ctx.setLineWidth(2)
    ctx.stroke()
  })

  // 绘制X轴标签
  ctx.setFillStyle('#666666')
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'

  data.forEach((item, index) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * index
    ctx.fillText(item.date, x, height - padding.bottom + 20)
  })

  // 绘制
  ctx.draw()
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
