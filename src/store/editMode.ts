import { defineStore } from "pinia";

export type EditMode =
    | 'Pen'
    | 'Eyedropper'

export const useEditMode = defineStore('editMode', {
    state: (): { mode: EditMode } => {
        return {
            mode: 'Pen',
        }
    },
    getters: {
        getMode(state) { return state.mode },
    },
    actions: {
        setMode(mode: EditMode) {
            this.mode = mode
        }
    },
})