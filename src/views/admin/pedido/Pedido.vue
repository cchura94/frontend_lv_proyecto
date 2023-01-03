<template>
    <h1>Lista Pedidos</h1>
     <DataTable :value="pedidos" responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="fecha" header="FECHA"></Column>
            <Column field="cliente.nombre_completo" header="CLIENTE"></Column>
            <Column field="user.email" header="Atendido por"></Column>
            <Column field="productos" header="PRODUCTOS">
                <template #body="slotProps">
                    <Button label="Mostrar Productos" icon="pi pi-external-link" @click="openModalProductos(slotProps.data.productos)" />
        
                </template>
            </Column>
        </DataTable>

        <Dialog header="Header" v-model:visible="displayModalProductos" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
            
            <DataTable :value="productos" responsiveLayout="scroll">
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="precio" header="Precio"></Column>
                <Column field="pivot.cantidad" header="Cantidad"></Column>
            </DataTable>

            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                <Button label="Yes" icon="pi pi-check" @click="closeModal" autofocus />
            </template>
        </Dialog>
</template>
<script>
import pedidoService from "@/service/pedido.service";
import {ref, onMounted} from "vue"

export default {
    setup() {

        const pedidos = ref([])
        const displayModalProductos = ref(false)
        const productos = ref([])

        onMounted(() => {
            listaPedidos()
        })

        const listaPedidos = async() =>  {
            const {data} = await pedidoService.getPedidos()
            pedidos.value = data.data
        }

        const openModalProductos = (prods) =>{
            displayModalProductos.value = true

            productos.value = prods

        }

        return {
            pedidos,
            displayModalProductos,
            openModalProductos,
            productos
        }
        
    },
}
</script>