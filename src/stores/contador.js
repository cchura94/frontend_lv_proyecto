import { defineStore } from 'pinia'

export const useContadorStore = defineStore({
    id: "Contador",
    // data()
    state: () => ({
        contador: 0,

    }),
    // methods
    actions: {
        aumentar() {
            this.contador++;
        },
        reducir() {
            this.contador--;
        }

    },
    getters: {
        esParImpar: (state) => {
            if(state.contador % 2 === 0){
                return "PAR";
            }
            return "IMPAR";
        }
    }
})