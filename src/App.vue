<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker.vue';
import TheCanvas from './components/TheCanvas.vue';

// import { storeToRefs } from 'pinia'
import { useCanvasImage } from './store/canvasImage'
import PenSizePicker from './components/PenSizePicker.vue';

const store = useCanvasImage()

const color = ref<string>("green")
const setcolor = (colorcode: string) => {
  color.value = colorcode
}

const save = async () => {
  // const dataurl = canvas.value.toDataURL('image/png')
  const url = store.getCanvas?.toDataURL('image/png')
  if (url === undefined) { return }

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
    <div class="bg-gray-50 p-1 flex flex-col">
      <ColorPicker :setcolor="setcolor"></ColorPicker>
      <div>
        <button class="bg-gray-600 text-white h-8 px-2 rounded" @click="save">save</button>
      </div>
      <PenSizePicker></PenSizePicker>
    </div>
    <TheCanvas :color="color"></TheCanvas>
  </div>
</template>
