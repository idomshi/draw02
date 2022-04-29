<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
    setcolor: (colorcode: string) => void
}>()

// 真ん中のボックスの色を指定する。
const hueColorStyle = computed(() => {
    return `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        linear-gradient(to left, hsl(${deg.value}deg, 100%, 50%), rgb(255, 255, 255, 1))`
})

// Pickerのマーカーがある場所を管理する。
const deg = ref(0)
const svPos = ref({ x: 0, y: 0 })
const huePos = computed(() => {
    const c = Math.cos(Math.PI * (deg.value - 180) / 180)
    const s = Math.sin(Math.PI * (deg.value - 180) / 180)
    return { x: 91.6 * c, y: 91.6 * s }
})
const colorCode = computed(() => {
    const h0 = deg.value
    const s0 = (svPos.value.x + 48) / 96
    const v0 = (96 - (svPos.value.y + 48)) / 96
    let r: number
    let g: number
    let b: number

    if (s0 === 0) {
        r = g = b = v0
    } else {
        const c1 = v0 * s0
        const h1 = h0 / 60
        const x1 = c1 * (1 - Math.abs(h1 % 2 - 1))
        const vc = v0 - c1

        if (h1 < 1) {
            [r, g, b] = [vc + c1, vc + x1, vc]
        } else if (h1 < 2) {
            [r, g, b] = [vc + x1, vc + c1, vc]
        } else if (h1 < 3) {
            [r, g, b] = [vc, vc + c1, vc + x1]
        } else if (h1 < 4) {
            [r, g, b] = [vc, vc + x1, vc + c1]
        } else if (h1 < 5) {
            [r, g, b] = [vc + x1, vc, vc + c1]
        } else if (h1 <= 6) {
            [r, g, b] = [vc + c1, vc, vc + x1]
        } else {
            [r, g, b] = [0, 0, 0]
        }
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
})

// touchevent関連の処理はこの辺。
const dragState = ref<'None' | 'Hue' | 'SV'>('None')
const pointerMove = (e: PointerEvent) => {
    if (dragState.value === 'Hue') {
        const d = Math.atan((e.offsetY - 96) / (e.offsetX - 96)) * 180 / Math.PI
        const degrees = (e.offsetX - 96) < 0 ? d : d + 180
        deg.value = degrees < 0 ? degrees + 360 : degrees
    } else if (dragState.value === 'SV') {


        svPos.value = {
            x: Math.min(48, Math.max(-48, e.offsetX - 96)),
            y: Math.min(48, Math.max(-48, e.offsetY - 96)),
        }
    }
}

const touchmove = (e: TouchEvent) => {
  if (dragState.value === 'None') return
  const t = e.touches.item(0)

  if (t?.clientX === undefined || t.clientY === undefined) { return }
  const buffX = t?.clientX
  const buffY = t?.clientY

    if (dragState.value === 'Hue') {
        const d = Math.atan((buffY - 96) / (buffX - 96)) * 180 / Math.PI
        const degrees = (buffX - 96) < 0 ? d : d + 180
        deg.value = degrees < 0 ? degrees + 360 : degrees
    } else if (dragState.value === 'SV') {


        svPos.value = {
            x: Math.min(48, Math.max(-48, buffX - 96)),
            y: Math.min(48, Math.max(-48, buffY - 96)),
        }
    }
}

const dragEnd = () => {
    dragState.value = 'None'
}

const svDragStart = (e: PointerEvent) => {
    const x = e.offsetX - 96
    const y = e.offsetY - 96
    const r = x ** 2 + y ** 2
    if (r > 80 ** 2 && r < 96 ** 2) {
        dragState.value = 'Hue'
    } else if (x > -48 && x < 48 && y > -48 && y < 48) {
        dragState.value = 'SV'
    }
}

watchEffect(() => props.setcolor(colorCode.value))
</script>

<template>
    <div class="flex flex-col" @pointermove="pointerMove" @pointerup="dragEnd" @pointerleave="dragEnd" @touchmove.prevent="touchmove">
        <div class="colorpicker w-48 h-48 border">
            <div class="colorcircle-o w-48 h-48 absolute rounded-full"></div>
            <div class="colorcircle-i w-40 h-40 m-4 absolute rounded-full"></div>
            <div class="colorbox w-24 h-24 m-12 absolute"></div>
        </div>
        <svg version="1.1" baseProfile="full" width="192" height="192" xmlns="http://www.w3.org/2000/svg"
            class="w-48 h-48 z-10 absolute" viewBox="-100 -100 200 200" @pointerdown="svDragStart">
            <circle :cx="huePos.x" :cy="huePos.y" r="6" fill="white" stroke="black" stroke-width="2" />
            <circle :cx="svPos.x" :cy="svPos.y" r="6" fill="white" stroke="black" stroke-width="2" />
        </svg>
        <p class="flex items-center gap-1">
        <div class="selected-color w-4 h-4 rounded"></div>{{ colorCode }}</p>
    </div>
</template>

<style scoped>
.colorbox {
    background: v-bind(hueColorStyle);
}

.colorpicker {
    background-color: #eee;
}

.colorcircle-o {
    background: conic-gradient(from 270deg, hsl(0deg, 100%, 50%), hsl(60deg, 100%, 50%) 16.7%, rgb(0, 255, 0) 33.3%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.7%, rgb(255, 0, 255) 83.3%, rgb(255, 0, 0));
}

.colorcircle-i {
    background-color: #eee;
}

.selected-color {
    background: v-bind(colorCode);
}
</style>