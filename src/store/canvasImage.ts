import { defineStore } from 'pinia'

export const useCanvasImage = defineStore('canvasImage', {
    state: (): { dataUrl: string, bufferCanvas: HTMLCanvasElement | undefined } => {
        return {
            dataUrl: '',
            bufferCanvas: undefined,
        }
    },
    getters: {
        getDataUrl (state) { return state.dataUrl },
        getCanvas (state) { return state.bufferCanvas },
    },
    actions: {
        setDataUrl(image: string) { this.dataUrl = image },
        setCanvas(el: HTMLCanvasElement) { this.bufferCanvas = el },
    },
})