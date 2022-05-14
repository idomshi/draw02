import { defineStore } from 'pinia'

const rgbToHsv = (r: number, g: number, b: number): { h: number, s: number, v: number } => {
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h
    if (r === g && g === b) {
        h = 0
    } else if (r === max) {
        h = 60 * ((g - b) / (max - min))
    } else if (g === max) {
        h = 60 * ((b - r) / (max - min)) + 120
    } else {
        h = 60 * ((r - g) / (max - min)) + 240
    }

    if (h < 0) { h += 360 }

    const s = (max - min) / max || 0
    const v = max / 255

    return { h, s, v }
}

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
        getColor(state) { return state.color },
        getColorCode(state) {
            const h0 = state.color.deg
            const s0 = (state.color.x + 48) / 96
            const v0 = (96 - (state.color.y + 48)) / 96
            let r: number
            let g: number
            let b: number

            if (s0 === 0) {
                r = g = b = v0
            } else {
                const c1 = v0 * s0
                const h1 = h0 / 60
                const x1 = c1 * (1 - Math.abs(h1 % 2 - 1))
                const vc = v0 - c1

                if (h1 < 1) {
                    [r, g, b] = [vc + c1, vc + x1, vc]
                } else if (h1 < 2) {
                    [r, g, b] = [vc + x1, vc + c1, vc]
                } else if (h1 < 3) {
                    [r, g, b] = [vc, vc + c1, vc + x1]
                } else if (h1 < 4) {
                    [r, g, b] = [vc, vc + x1, vc + c1]
                } else if (h1 < 5) {
                    [r, g, b] = [vc + x1, vc, vc + c1]
                } else if (h1 <= 6) {
                    [r, g, b] = [vc + c1, vc, vc + x1]
                } else {
                    [r, g, b] = [0, 0, 0]
                }
            }

            return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`

        },
        getPenSize(state) { return state.size },
    },
    actions: {
        setColor(colorProps: { deg?: number; x?: number; y?: number }) {
            if (colorProps.deg !== undefined) { this.color.deg = colorProps.deg }
            if (colorProps.x !== undefined) { this.color.x = colorProps.x }
            if (colorProps.y !== undefined) { this.color.y = colorProps.y }
        },
        setColorRGB(r: number, g: number, b: number) {
            const { h, s, v } = rgbToHsv(r, g, b)
            console.log([h, s, v, s * 96 - 48, (v * 96 - 48)])
            this.color.deg = h
            this.color.x = s * 96 - 48
            this.color.y = -(v * 96 - 48)
        },
        setSize(size: number) {
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