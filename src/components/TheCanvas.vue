<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { ref, reactive, onMounted, watchEffect, watch } from 'vue';

import { useCanvasImage } from '../store/canvasImage';
import { usePenSettings } from '../store/penSettings';

const store = useCanvasImage()
const penStore = usePenSettings()

const viewcanvas = ref<HTMLCanvasElement>()
const buffercanvas = ref<HTMLCanvasElement>()
const { width, height } = useElementSize(viewcanvas)

const viewPos = reactive<{
  x: number
  y: number
}>({ x: 0, y: 0 })

const drawing = ref<boolean>(false)

const pointerdown = (e: PointerEvent) => {
  if (store.getBufferCtx === undefined) { return }
  if (e.buttons === 1 && e.pressure > 0.0) {
    drawing.value = true
    const buffX = e.offsetX - viewPos.x
    const buffY = e.offsetY - viewPos.y
    store.getBufferCtx.beginPath()
    store.getBufferCtx.moveTo(buffX, buffY)
  }
}

const pointermove = (e: PointerEvent) => {
  if (!drawing.value) return

  const buffX = e.offsetX - viewPos.x
  const buffY = e.offsetY - viewPos.y

  if (store.getBufferCtx === undefined) { return }
  store.getBufferCtx.lineTo(buffX, buffY)
  store.getBufferCtx.lineWidth = penStore.getPenSize
  store.getBufferCtx.stroke()
  store.redraw()
}

const touchmove = (e: TouchEvent) => {
  if (!drawing.value) return
  const t = e.touches.item(0)

  if (t?.clientX === undefined || t.clientY === undefined) { return }
  const buffX = t?.clientX - (viewcanvas.value?.offsetLeft || 0) - viewPos.x
  const buffY = t?.clientY - (viewcanvas.value?.offsetTop || 0) - viewPos.y

  if (store.getBufferCtx === undefined) { return }
  store.getBufferCtx.lineTo(buffX, buffY)
  store.getBufferCtx.lineWidth = penStore.getPenSize
  store.getBufferCtx.stroke()
  store.redraw()
}

const pointerup = () => {
  drawing.value = false
  store.setDataUrl()
}

watchEffect(() => {
  if (store.bufferctx === undefined) { return }
  store.bufferctx.strokeStyle = penStore.getColorCode
})

watch([width, height], store.redraw, { flush: 'post' })

onMounted(async () => {
  if (viewcanvas.value === undefined) { return }
  // viewctx.value = viewcanvas.value.getContext('2d') || undefined
  store.setViewCanvas(viewcanvas.value)

  if (buffercanvas.value === undefined) { return }
  // bufferctx.value = buffercanvas.value.getContext('2d') || undefined
  store.setBufferCanvas(buffercanvas.value)
  
  if (store.getBufferCtx === undefined) { return }
  store.getBufferCtx.save()
  store.getBufferCtx.fillStyle = '#ffffff'
  store.getBufferCtx.fillRect(0, 0, buffercanvas.value.width, buffercanvas.value.height)
  store.getBufferCtx.restore()
  store.getBufferCtx.lineCap = 'round'
  store.getBufferCtx.lineJoin = 'round'

  const imageString = store.getDataUrl
  if (imageString !== '') {
    const img = new Image()
    img.addEventListener('load', () => {
      if (store.getBufferCtx === undefined) { return }
      store.getBufferCtx.drawImage(img, 0, 0)
      store.redraw()
    })
    img.src = imageString 
  }
})

const buffer = reactive({ width: 1024, height: 1024 })
</script>

<template>
  <div class="h-full w-full shrink">
    <canvas class="hidden" ref="buffercanvas" :width="buffer.width" :height="buffer.height"></canvas>
    <canvas
      class="h-full w-full shrink bg-gray-200"
      ref="viewcanvas"
      :width="width"
      :height="height"
      @pointerdown.prevent="pointerdown"
      @pointermove.prevent="pointermove"
      @pointerup.prevent="pointerup"
      @touchmove.prevent="touchmove"
    ></canvas>
  </div>
</template>