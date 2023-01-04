import { defineStore } from "pinia";
import {ref, computed} from "vue";

export const useAuthStore = defineStore('auth', () => {
    let inicial = null
    try{
        inicial = JSON.parse(localStorage.getItem("user"))

    }catch(e){
        inicial = null
    }
    const usuario = ref(inicial);

    const logueado = (user) => {
        usuario.value = user
    }

    const obtenerPerfil = () => {
        return usuario.value
    }

    return { usuario, obtenerPerfil, logueado}

})