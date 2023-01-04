<template>
<div class="card">
    <h1>Usuarios - 
        {{ micontador.contador }}
    </h1>

    <Button label="Nuevo Usuario" icon="pi pi-user" @click="openModal" />
        <Dialog header="Nuevo Usuario" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true" class="p-fluid">
            
            <label for="name">Nombre</label>
            <InputText type="text" v-model="usuario.name" />
            <span v-if="errores.name">{{ errores.name }}</span>

            <label for="name">Correo</label>
            <InputText type="email" v-model="usuario.email" />
            <span v-if="errores.email">{{ errores.email }}</span>

            <label for="name">Contraseña</label>
            <InputText type="password" v-model="usuario.password" />
            <span v-if="errores.password">{{ errores.password }}</span>

            {{ usuario }}

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                <Button label="Guardar Usuario" icon="pi pi-check" @click="guardarUsuario" autofocus />
            </template>
        </Dialog>

<ProgressBar v-if="cargando" mode="indeterminate" style="height: .5em" />

    <DataTable :value="usuarios.data" responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="NOMBRE"></Column>
            <Column field="email" header="CORREO"></Column>
            <Column field="created_at" header="CREADO EN"></Column>
        </DataTable>

</div>
  
</template>

<script>
import usuarioService from "@/service/usuario.service"
import { onMounted, ref } from 'vue'

import { useContadorStore } from '@/stores/contador.js'
export default {
    setup() {

        const micontador = useContadorStore()

        const usuarios = ref([])
        const displayModal = ref(false)
        const usuario = ref({name: '', email: '', password: ''})
        const errores = ref({})
        const cargando = ref(true)
        
        onMounted(() => {
            listarUsuarios()
        })

        const openModal = () => {
            displayModal.value = true
        }
        const closeModal = () => {
            displayModal.value = false
        }
        const listarUsuarios = async () => {
            try{
                cargando.value = true
                const {data} = await usuarioService.getUsuarios()
                usuarios.value = data
            }catch(error){
                console.log(error)
            }
            cargando.value = false
        }
        const guardarUsuario = async () => {

             try{
                cargando.value = true
                const {data} = await usuarioService.storeUsuario(usuario.value)
                // alert("Usuario registrado!!")
                closeModal()
                listarUsuarios()
            }catch(error){
                console.log("***********************",error.response.data);
                errores.value = error.response.data.errors
                // alert("Error al registrar el Usuario!!")
            }
        }

        return {
            usuarios,
            displayModal,
            openModal,
            closeModal,
            guardarUsuario,
            usuario,
            errores,
            cargando,
            micontador
        }
    }

}
</script>

<style>

</style>