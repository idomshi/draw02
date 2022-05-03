import { defineStore } from 'pinia'

export const usePenSettings = defineStore('penSettings', {
    state: (): { size: number; color: { deg: number; x: number; y: number } } => {
        return {
            size: 2,
            color: {
                deg: 0,
                x: 0,
                y: 0,
            },
        }
    },
    getters: {
        getColor (state) { return state.color },
        getPenSize (state) { return state.size },
    },
    actions: {
        setColor (colorProps: { deg?: number; x?: number; y?: number }) {
            if (colorProps.deg !== undefined) { this.color.deg = colorProps.deg }
            if (colorProps.x !== undefined) { this.color.x = colorProps.x }
            if (colorProps.y !== undefined) { this.color.y = colorProps.y }
        },
        setSize (size: number) {
            this.size = size
        },
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage },
        ],
    },
})