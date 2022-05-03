import { defineStore } from 'pinia'
// import { useLocalStorage } from '@vueuse/core'

// // localstorageで使うやつ。
// const activePenColorKey = 'ACTIVE_PEN_COLOR'
// type ActivePenColor = { deg: number; svPos: { x: number, y: number } }

// // localstorageに保存されているイメージを読み込む。
// const localStorage = useLocalStorage<ActivePenColor>(activePenColorKey, {
//   deg: 0,
//   svPos: { x: 0, y: 0 },
// })

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
        setColor (colorProps: { deg: number; x: number; y: number }) {
            this.color.deg = colorProps.deg
            this.color.x = colorProps.x
            this.color.y = colorProps.y

            localStorage.value.deg = colorProps.deg
            localStorage.value.svPos.x = colorProps.x
            localStorage.value.svPos.y = colorProps.y
        },
        setSize (size: number) {
            this.size = size
        },
    },
})