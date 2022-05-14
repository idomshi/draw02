<script setup lang="ts">
import { useEditMode } from '../store/editMode';
const mode = useEditMode()
const setEyedropperMode = () => {
    mode.setMode('Eyedropper')
}
</script>

<template>
    <button class="bg-gray-600 text-white h-8 px-2 rounded" @click="setEyedropperMode">eyedropper</button>
</template>