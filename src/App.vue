<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import ColorPicker from './components/ColorPicker.vue';

const el = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D>()
const { width, height } = useElementSize(el)

const viewPos = reactive<{
  x: Number
  y: Number
}>({ x: 0, y: 0 })

const drawing = ref<boolean>(false)

const pointerdown = (e: PointerEvent) => {
  if (e.buttons === 1 && e.pressure > 0.0) {
    drawing.value = true
    const buffX = e.offsetX - viewPos.x.valueOf()
    const buffY = e.offsetY - viewPos.y.valueOf()
    ctx.value?.beginPath()
    ctx.value?.moveTo(buffX, buffY)
  }
}

const pointermove = (e: PointerEvent) => {
  if (!drawing.value) return

  const buffX = e.offsetX - viewPos.x.valueOf()
  const buffY = e.offsetY - viewPos.y.valueOf()

  if (ctx.value === undefined) { return }
  ctx.value.lineTo(buffX, buffY)
  ctx.value.lineWidth = 2
  ctx.value.strokeStyle = color.value
  ctx.value.stroke()
}

const touchmove = (e: TouchEvent) => {
  if (!drawing.value) return
  const t = e.touches.item(0)

  if (t?.clientX === undefined || t.clientY === undefined) { return }
  const buffX = t?.clientX - (el.value?.offsetLeft || 0) - viewPos.x.valueOf()
  const buffY = t?.clientY - (el.value?.offsetTop || 0) - viewPos.y.valueOf()

  if (ctx.value === undefined) { return }
  ctx.value.lineTo(buffX, buffY)
  ctx.value.lineWidth = 2
  ctx.value.strokeStyle = color.value
  ctx.value.stroke()
}

const pointerup = () => {
  drawing.value = false
}

onMounted(() => {
  if (el.value === null) { return }
  ctx.value = el.value?.getContext('2d') || undefined
})

const color = ref<string>("green")

const setcolor = (colorcode: string) => {
  color.value = colorcode
}
</script>

<template>
  <div class="flex h-screen">
    <div class="bg-gray-50 p-1 flex">
    <ColorPicker :setcolor="setcolor"></ColorPicker>
    </div>
    <canvas class="h-full w-full shrink" ref="el" :width="width" :height="height" @pointerdown.prevent="pointerdown"
      @pointermove.prevent="pointermove" @pointerup.prevent="pointerup" @touchmove.prevent="touchmove"></canvas>
  </div>
</template>
