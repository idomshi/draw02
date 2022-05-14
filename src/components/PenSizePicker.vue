<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePenSettings } from '../store/penSettings';

const store = usePenSettings()
const setSize = (e: any) => {
    const size = parseInt(e.target.value)
    store.setSize(size)
}

const min = 1
const max = 150
const sliderMin = 12
const sliderMax = 192 - 12

const sliderPos = computed(() => {
    return (sliderMax - sliderMin) / (max - min) * (store.getPenSize - min) + sliderMin
})

const sliderPosToPenSize = (pos: number): number => {
    return Math.round((max - min) / (sliderMax - sliderMin) * (pos - sliderMin) + min)
}

const dragging = ref(false)
const dragStart = (e: PointerEvent) => {
    const x = Math.min(sliderMax, Math.max(sliderMin, e.offsetX))
    const size = sliderPosToPenSize(x)
    store.setSize(size)
    dragging.value = true
}

const touchStart = (e: TouchEvent) => {
    const t = e.touches.item(0)
    if (t?.clientX === undefined) { return }
    const x = Math.min(sliderMax, Math.max(sliderMin, t.clientX))
    const size = sliderPosToPenSize(x)
    store.setSize(size)
    dragging.value = true
}

const pointerMove = (e: PointerEvent) => {
    if (!dragging.value) { return }

    const x = Math.min(sliderMax, Math.max(sliderMin, e.offsetX))
    const size = sliderPosToPenSize(x)
    store.setSize(size)
}

const toucheMove = (e: TouchEvent) => {
    if (!dragging.value) { return }

    const t = e.touches.item(0)
    if (t?.clientX === undefined) { return }
    const x = Math.min(sliderMax, Math.max(sliderMin, t.clientX))
    const size = sliderPosToPenSize(x)
    store.setSize(size)
}

const dragEnd = () => { dragging.value = false }
</script>

<template>
    <div class="flex flex-col w-48">
        <p>ペンサイズ</p>
        <input type="text" name="pen-size" id="pen-size" :value="store.getPenSize" @keyup="setSize">
        <svg width="192" height="24" class="w-48 h-6 bg-blue-50" @pointerdown="dragStart" @touchstart="touchStart"
            @pointermove.prevent="pointerMove" @touchmove.prevent="toucheMove" @pointerup="dragEnd" @pointerleave="dragEnd"
            @touchend="dragEnd">
            <line x1="12" y1="12" x2="180" y2="12" stroke="#cccccc" stroke-width="2" />
            <circle :cx="sliderPos" cy="12" r="6" fill="white" stroke="black" stroke-width="2" />
        </svg>
    </div>
</template>