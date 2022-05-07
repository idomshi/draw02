import { defineStore } from 'pinia'

// 多分bufferctxに線を描いてviewctxに反映するところまでをここに書いちゃって良いと思うんだけど。
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
        setDataUrl() { this.dataUrl = this.bufferCanvas?.toDataURL('image/png') || '' },
        setCanvas(el: HTMLCanvasElement) { this.bufferCanvas = el },
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage },
        ],
    },
})