<script setup lang="ts">
import { useElementSize, useLocalStorage } from '@vueuse/core'
import { ref, reactive, onMounted, watchEffect, watch, withCtx } from 'vue';

import { useCanvasImage } from '../store/canvasImage';
import { usePenSettings } from '../store/penSettings';

const store = useCanvasImage()
const penStore = usePenSettings()

const props = defineProps<{
  color: string
}>()

// localstorageで使うやつ。
const activeCanvasImageKey = 'ACTIVE_CANVAS_IMAGE'
type ActiveCanvasImage = { imageString: string }

// localstorageに保存されているイメージを読み込む。
const localStorage = useLocalStorage<ActiveCanvasImage>(activeCanvasImageKey, {
  imageString: '',
})

const viewcanvas = ref<HTMLCanvasElement>()
const viewctx = ref<CanvasRenderingContext2D>()
const buffercanvas = ref<HTMLCanvasElement>()
const bufferctx = ref<CanvasRenderingContext2D>()
const { width, height } = useElementSize(viewcanvas)

const viewPos = reactive<{
  x: number
  y: number
}>({ x: 0, y: 0 })

const drawing = ref<boolean>(false)

const redraw = () => {
  if (viewctx.value === null || viewctx.value === undefined) { return }
  if (viewcanvas.value === null || viewcanvas.value === undefined) { return }
  if (buffercanvas.value === null || buffercanvas.value === undefined) { return }
  const sourceW = buffercanvas.value.width
  const sourceH = buffercanvas.value.height
  const viewW = viewcanvas.value.width
  const viewH = viewcanvas.value.height

  viewctx.value.clearRect(0, 0, viewW, viewH)
  viewctx.value.drawImage(buffercanvas.value, 0, 0, sourceW, sourceH, 0, 0, sourceW, sourceH)
}

const pointerdown = (e: PointerEvent) => {
  if (bufferctx.value === null || bufferctx.value === undefined) { return }
  if (e.buttons === 1 && e.pressure > 0.0) {
    drawing.value = true
    const buffX = e.offsetX - viewPos.x
    const buffY = e.offsetY - viewPos.y
    bufferctx.value.beginPath()
    bufferctx.value.moveTo(buffX, buffY)
  }
}

const pointermove = (e: PointerEvent) => {
  if (!drawing.value) return

  const buffX = e.offsetX - viewPos.x
  const buffY = e.offsetY - viewPos.y

  if (bufferctx.value === undefined) { return }
  bufferctx.value.lineTo(buffX, buffY)
  bufferctx.value.lineWidth = penStore.getPenSize
  bufferctx.value.stroke()
  redraw()
}

const touchmove = (e: TouchEvent) => {
  if (!drawing.value) return
  const t = e.touches.item(0)

  if (t?.clientX === undefined || t.clientY === undefined) { return }
  const buffX = t?.clientX - (viewcanvas.value?.offsetLeft || 0) - viewPos.x
  const buffY = t?.clientY - (viewcanvas.value?.offsetTop || 0) - viewPos.y

  if (bufferctx.value === undefined) { return }
  bufferctx.value.lineTo(buffX, buffY)
  bufferctx.value.lineWidth = penStore.getPenSize
  bufferctx.value.stroke()
  redraw()
}

const pointerup = () => {
  drawing.value = false
  localStorage.value.imageString = buffercanvas.value?.toDataURL() || ''
}

watchEffect(() => {
  if (bufferctx.value === undefined) { return }
  bufferctx.value.strokeStyle = props.color
})

watch([width, height], redraw, { flush: 'post' })

onMounted(async () => {
  if (viewcanvas.value === undefined) { return }
  viewctx.value = viewcanvas.value.getContext('2d') || undefined

  if (buffercanvas.value === undefined) { return }
  bufferctx.value = buffercanvas.value.getContext('2d') || undefined
  store.setCanvas(buffercanvas.value)
  
  if (bufferctx.value === undefined) { return }
  bufferctx.value.save()
  bufferctx.value.fillStyle = '#ffffff'
  bufferctx.value.fillRect(0, 0, buffercanvas.value.width, buffercanvas.value.height)
  bufferctx.value.restore()
  bufferctx.value.lineCap = 'round'
  bufferctx.value.lineJoin = 'round'

  // localstorageからキャンバスを復元する。
  const { imageString } = localStorage.value
  if (imageString !== '') {
    const img = new Image()
    img.addEventListener('load', () => {
      if (bufferctx.value === undefined) { return }
      bufferctx.value.drawImage(img, 0, 0, 1024, 1024)
      redraw()
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