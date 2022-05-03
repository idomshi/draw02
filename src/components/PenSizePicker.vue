<script setup lang="ts">
import { usePenSettings } from '../store/penSettings';

const store = usePenSettings()
const setSize = (e: any) => {
    const size = parseInt(e.target.value)
    store.setSize(size)
}
</script>

<template>
<div>
    ペンサイズ
    <input type="text" name="pen-size" id="pen-size" :value="store.getPenSize" @keyup="setSize">
</div>
</template>