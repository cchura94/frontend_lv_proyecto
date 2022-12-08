<template>
{{ usuario }}
    <h1>Ingresar</h1>
    <input type="text" placeholder="Ingrese su correo" v-model="usuario.email">
    {{ errores.email }}
    <br>
    <input type="password" placeholder="Ingrese su contraseña" v-model="usuario.password">
    {{ errores.password }}
    <br>
    <button @click="ingresar()">Ingresar</button>
</template>

<script>
import authService from "@/service/auth.service.js";
import {ref} from "vue"
import { useRouter } from 'vue-router'

export default {
    setup() {
        const router = useRouter()

        const usuario = ref({})
        const errores = ref({});

        const ingresar = async () => {
            try{
                const {data} = await authService.loginConLaravel(usuario.value)
                console.log(data);
                localStorage.setItem("access_token", data.access_token)
                router.push({name: 'Perfil'})

            }catch(error){
                console.log(error)
                errores.value = error.response.data.errors
                alert("Usuario Incorrecto")
            }

        }

        return {usuario, errores, ingresar}
    }

}

</script>