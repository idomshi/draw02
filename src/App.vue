<script setup lang="ts">
import ColorPicker from './components/ColorPicker.vue';
import PenSizePicker from './components/PenSizePicker.vue';
import TheCanvas from './components/TheCanvas.vue';

import { useCanvasImage } from './store/canvasImage'
import EyedropperTool from './components/EyedropperTool.vue';

// saveだけならここに書く必要もないんだけど。
const store = useCanvasImage()
const save = async () => {
  const url = store.getDataUrl
  if (url === '') { return }

  const a = document.createElement("a")
  document.body.appendChild(a)
  a.download = 'image.png'
  a.href = url
  a.click()
  a.remove()
}
</script>

<template>
  <div class="flex h-screen">
    <div class="bg-gray-50 p-1 flex flex-col gap-1">
      <ColorPicker></ColorPicker>
      <EyedropperTool></EyedropperTool>
      <div>
        <button class="bg-gray-600 text-white h-8 px-2 rounded" @click="save">save</button>
      </div>
      <PenSizePicker></PenSizePicker>
    </div>
    <TheCanvas></TheCanvas>
  </div>
</template>
