import { defineStore } from 'pinia'

// 多分bufferctxに線を描いてviewctxに反映するところまでをここに書いちゃって良いと思うんだけど。
export const useCanvasImage = defineStore('canvasImage', {
    state: (): {
        dataUrl: string
        bufferCanvas: HTMLCanvasElement | undefined
        bufferctx: CanvasRenderingContext2D | undefined
        viewCanvas: HTMLCanvasElement | undefined
        viewctx: CanvasRenderingContext2D | undefined
    } => {
        return {
            dataUrl: '',
            bufferCanvas: undefined,
            bufferctx: undefined,
            viewCanvas: undefined,
            viewctx: undefined,
        }
    },
    getters: {
        getDataUrl (state) { return state.dataUrl },
        getCanvas (state) { return state.bufferCanvas },
        getBufferCtx (state) { return state.bufferctx },
    },
    actions: {
        setDataUrl() { this.dataUrl = this.bufferCanvas?.toDataURL('image/png') || '' },
        setBufferCanvas(el: HTMLCanvasElement) {
            this.bufferCanvas = el
            this.bufferctx = el.getContext('2d') || undefined
        },
        setViewCanvas(el: HTMLCanvasElement) {
            this.viewCanvas = el
            this.viewctx = el.getContext('2d') || undefined
        },
        redraw() {
            if (this.viewctx === undefined ) { return }
            if (this.viewCanvas === undefined ) { return }
            if (this.bufferCanvas === undefined ) { return }
            const sourceW = this.bufferCanvas.width
            const sourceH = this.bufferCanvas.height
            const viewW = this.viewCanvas.width
            const viewH = this.viewCanvas.height

            this.viewctx.clearRect(0, 0, viewW, viewH)
            this.viewctx.drawImage(this.bufferCanvas, 0, 0, sourceW, sourceH, 0, 0, sourceW, sourceH)
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['dataUrl'],
            },
        ],
    },
})