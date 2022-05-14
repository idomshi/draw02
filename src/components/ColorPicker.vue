<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia'
import { usePenSettings } from '../store/penSettings';

// 真ん中のボックスの色を指定する。
const hueColorStyle = computed(() => {
    return `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        linear-gradient(to left, hsl(${color.value.deg}deg, 100%, 50%), rgb(255, 255, 255, 1))`
})

// Pickerのマーカーがある場所を管理する。
const pensettings = usePenSettings()
const { color, getColorCode } = storeToRefs(pensettings)
const huePos = computed(() => {
    const c = Math.cos(Math.PI * (color.value.deg - 180) / 180)
    const s = Math.sin(Math.PI * (color.value.deg - 180) / 180)
    return { x: 91.6 * c, y: 91.6 * s }
})

// touchevent関連の処理はこの辺。
const dragState = ref<'None' | 'Hue' | 'SV'>('None')
const pointerMove = (e: PointerEvent) => {
    if (dragState.value === 'Hue') {
        const d = Math.atan((e.offsetY - 96) / (e.offsetX - 96)) * 180 / Math.PI
        const degrees = (e.offsetX - 96) < 0 ? d : d + 180
        pensettings.setColor({ deg: degrees < 0 ? degrees + 360 : degrees })
    } else if (dragState.value === 'SV') {
        pensettings.setColor({
            x: Math.min(48, Math.max(-48, e.offsetX - 96)),
            y: Math.min(48, Math.max(-48, e.offsetY - 96)),
        })
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
        pensettings.setColor({ deg: degrees < 0 ? degrees + 360 : degrees })
    } else if (dragState.value === 'SV') {
        pensettings.setColor({
            x: Math.min(48, Math.max(-48, buffX - 96)),
            y: Math.min(48, Math.max(-48, buffY - 96)),
        })
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

const svgTouchStart = (e: TouchEvent) => {
    const t = e.touches.item(0)
    if (t?.clientX === undefined || t?.clientY === undefined) { return }
    const x = t.clientX - 96
    const y = t.clientY - 96
    const r = x ** 2 + y ** 2
    if (r > 80 ** 2 && r < 96 ** 2) {
        dragState.value = 'Hue'
    } else if (x > -48 && x < 48 && y > -48 && y < 48) {
        dragState.value = 'SV'
    }
}
</script>

<template>
    <div class="flex flex-col" @pointermove="pointerMove" @pointerup="dragEnd" @pointerleave="dragEnd" @touchmove.prevent="touchmove" @touchend="dragEnd">
        <div class="colorpicker w-48 h-48 border">
            <div class="colorcircle-o w-48 h-48 absolute rounded-full"></div>
            <div class="colorcircle-i w-40 h-40 m-4 absolute rounded-full"></div>
            <div class="colorbox w-24 h-24 m-12 absolute"></div>
        </div>
        <svg version="1.1" baseProfile="full" width="192" height="192" xmlns="http://www.w3.org/2000/svg"
            class="w-48 h-48 z-10 absolute" viewBox="-100 -100 200 200" @pointerdown="svDragStart" @touchstart="svgTouchStart">
            <circle :cx="huePos.x" :cy="huePos.y" r="6" fill="white" stroke="black" stroke-width="2" />
            <circle :cx="color.x" :cy="color.y" r="6" fill="white" stroke="black" stroke-width="2" />
        </svg>
        <p class="flex items-center gap-1">
        <div class="selected-color w-4 h-4 rounded"></div>{{ getColorCode }}</p>
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
    background: v-bind(getColorCode);
}
</style>