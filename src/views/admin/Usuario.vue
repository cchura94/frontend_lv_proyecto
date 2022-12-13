<template>
<div class="card">
    <h1>Usuarios</h1>
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

export default {
    setup() {
        const usuarios = ref([])
        
        onMounted(async () => {
            const {data} = await usuarioService.getUsuarios()
            usuarios.value = data
        })

        return {
            usuarios
        }
    }

}
</script>

<style>

</style>