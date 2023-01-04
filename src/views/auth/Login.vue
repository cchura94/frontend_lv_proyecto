<template>
<!--
{{ usuario }}
    <h1>Ingresar</h1>
    <input type="text" placeholder="Ingrese su correo" v-model="usuario.email">
    {{ errores.email }}
    <br>
    <input type="password" placeholder="Ingrese su contraseña" v-model="usuario.password">
    {{ errores.password }}
    <br>
    <button @click="ingresar()">Ingresar</button>
-->
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!--img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /-->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenido!</div>
                        <span class="text-600 font-medium">Ingresar</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Correo Electronico" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="usuario.email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="usuario.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

<!--
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        -->
                        <Button @click="ingresar()" label="Ingresar" class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<script>
import authService from "@/service/auth.service.js";
import {ref} from "vue"
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/auth.js"

export default {
    setup() {

        const miStorePinia = useAuthStore()

        const router = useRouter()

        const usuario = ref({})
        const errores = ref({});

        const ingresar = async () => {
            try{
                const {data} = await authService.loginConLaravel(usuario.value)
                console.log(data);
                // crgar en pinia
                miStorePinia.logueado(data)
                
                localStorage.setItem("user", JSON.stringify(data))
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