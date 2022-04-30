<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker.vue';
import TheCanvas from './components/TheCanvas.vue';

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
    <TheCanvas :color="color"></TheCanvas>
  </div>
</template>
