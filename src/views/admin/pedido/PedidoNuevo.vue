<template>
  <div class="grid">
    <div class="col-8">
      <div class="card">
        <DataView
          :value="productos"
          :layout="layout"
          :paginator="true"
          :rows="9"
          :sortOrder="sortOrder"
          :sortField="sortField"
        >
          <template #header>
            <div class="grid grid-nogutter">
              <div class="col-6" style="text-align: left">
                <Dropdown
                  v-model="sortKey"
                  :options="sortOptions"
                  optionLabel="label"
                  placeholder="Sort By Price"
                  @change="onSortChange($event)"
                />
              </div>
              <div class="col-6" style="text-align: right">
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
          </template>

          <template #list="slotProps">
            <div class="col-12">
              <div class="product-list-item">
                <img
                  :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`"
                  :alt="slotProps.data.nombre"
                />
                <div class="product-list-detail">
                  <div class="product-name">{{ slotProps.data.nombre }}</div>
                  <div class="product-description">
                    {{ slotProps.data.descripcion }}
                  </div>
                  <!--
                  <Rating
                    :modelValue="slotProps.data.rating"
                    :readonly="true"
                    :cancel="false"
                  ></Rating>
                  -->
                  <i class="pi pi-tag product-category-icon"></i
                  ><span class="product-category">{{
                    slotProps.data.categoria.nombre
                  }}</span>
                </div>
                <div class="product-list-action">
                  <span class="product-price">${{ slotProps.data.precio }}</span>
                  <Button
                    icon="pi pi-shopping-cart"
                    label="Agregar"
                    :disabled="slotProps.data.estado?false:true"
                    @click="agregarCarrito(slotProps.data)"
                  ></Button>
                  <span
                    :class="
                      'product-badge status-' +
                      slotProps.data.estado
                    "
                    >{{ slotProps.data.estado?'ACTIVO':'INACTIVO' }}</span
                  >
                </div>
              </div>
            </div>
          </template>

        </DataView>
      </div>
    </div>
    <div class="col-4">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <DataTable :value="carrito" class="p-datatable-sm" responsiveLayout="scroll">
                <template #header>
                    Carrito
                </template>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="precio" header="Precio"></Column>
                <Column field="cantidad" header="Cant"></Column>
            </DataTable>
          </div>
        </div>
        <div class="col-12">
          <div class="card">
            <h5>Cliente</h5>
             <Button label="Nuevo Cliente" icon="pi pi-external-link" @click="openModalCliente" />
        <Dialog header="Nuevo Cliente" v-model:visible="displayModalCliente" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '30vw'}" :modal="true" class="p-fluid">
            
            <div class="field">
              <label for="name">Nombre Completo</label>
              <InputText
                id="name"
                v-model.trim="cliente.nombre_completo"
                required="true"
                autofocus
              />
            </div>
            <div class="field">
              <label for="ci_nit">CI/NIT</label>
              <InputText
                id="ci_nit"
                v-model.trim="cliente.ci_nit"
                required="true"
                autofocus
              />
            </div>
            <div class="field">
              <label for="tel">telefono</label>
              <InputText
                id="tel"
                v-model.trim="cliente.telefono"
                required="true"
                autofocus
              />
            </div>           
            

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" @click="closeModalCliente" class="p-button-text"/>
                <Button label="Guardar Cliente" icon="pi pi-check" @click="guardarCliente" autofocus />
            </template>
        </Dialog>

        <InputText
                v-model.trim="buscar_cliente"
                autofocus
                @keyup.enter="buscarCliente()"
              />

          <div class="card" v-if="cliente_seleccionado">
            <h5>CLIENTE: {{ cliente_seleccionado.nombre_completo }}</h5>
            <h5>CI/NIT: {{ cliente_seleccionado.ci_nit }}</h5>
            <h5>TELEFONO: {{ cliente_seleccionado.telefono }}</h5>
          </div>
          </div>
        </div>
        <div class="col-12">
          <div class="card">
            <h5>Detalle</h5>
            <h5>TOTAL: {{total}}</h5>
          </div>
        </div>
        <div class="col-12">
          <div class="card">
            <Button label="Registrar Pedido" icon="pi pi-check" class="block" @click="guardarPedido" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import productoService from "@/service/producto.service";
import clienteService from "@/service/cliente.service";
import pedidoService from "@/service/pedido.service";

export default {
    setup() {

        onMounted(() => {
            listarProductos()
        })

        const productos = ref()
        const layout = ref('grid');
        const sortKey = ref();
        const sortOrder = ref();
        const sortField = ref();
        const sortOptions = ref([
            {label: 'Price High to Low', value: '!price'},
            {label: 'Price Low to High', value: 'price'},
        ]);
        const carrito = ref([])
        const displayModalCliente = ref(false)
        const cliente = ref({nombre_completo: '', ci_nit: '', telefono: ''})
        const cliente_seleccionado = ref(null)
        const buscar_cliente = ref('')
        const total = ref(0);


        const openModalCliente = () => {
          displayModalCliente.value = true
        }

        const closeModalCliente = () => {
          displayModalCliente.value = false
        }


        const listarProductos = async () => {
            const {data} = await productoService.getProductos()
            productos.value = data.data
            console.log(data.data)
        }

        const agregarCarrito = (prod) => {
          let sw=0;
          carrito.value.forEach(pr => {
            if(pr.id == prod.id){
              pr.cantidad++;
              sw=1;
            }
          });
          if(sw==0){
            carrito.value.push({id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1})          
          }

          getTotal()          
          
        }

        const guardarCliente = async () => {
          const {data} = await clienteService.storeCliente(cliente.value);
          cliente_seleccionado.value = data
          closeModalCliente()
        }

        const buscarCliente = async () => {
          const {data} = await clienteService.getCliente(buscar_cliente.value)
          if(data){
            cliente_seleccionado.value = data
          }else{
            cliente_seleccionado.value = null
          }
        }

        const getTotal = () => {
          let st = 0;
          let p = 0;

          for (let i = 0; i < carrito.value.length; i++) {
            const pr = carrito.value[i];
            p = pr.precio * pr.cantidad
            st = st + p
          }

          total.value = st
        }

        const guardarPedido = async () => {
          let datos = {
            cliente_id: cliente_seleccionado.value.id,
            productos: []
          }
          for (let i = 0; i < carrito.value.length; i++) {
            const pr = carrito.value[i];
            console.log(pr)
            datos.productos.push({producto_id: pr.id, cantidad: pr.cantidad})
          }
          console.log(datos)

          const {data} = await pedidoService.storePedido(datos)
          console.log(data)

        }

        const onSortChange = (event) => {
            const value = event.value.value;
            const sortValue = event.value;

            if (value.indexOf('!') === 0) {
                sortOrder.value = -1;
                sortField.value = value.substring(1, value.length);
                sortKey.value = sortValue;
            }
            else {
                sortOrder.value = 1;
                sortField.value = value;
                sortKey.value = sortValue;
            }
        };

        return {
            productos,
            layout,
            sortKey,
            sortOrder,
            sortField,
            sortOptions, onSortChange, carrito, agregarCarrito, displayModalCliente, openModalCliente, closeModalCliente,
            guardarCliente,
            cliente,
            cliente_seleccionado,
            buscar_cliente,
            buscarCliente,
            total,
            guardarPedido
        }

        
    },
}
</script>

<style lang="scss" scoped>
.card {
    background: #ffffff;
    padding: 2rem;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    border-radius: 4px;
    margin-bottom: 2rem;
}
.p-dropdown {
    width: 14rem;
    font-weight: normal;
}

.product-name {
	font-size: 1.5rem;
	font-weight: 700;
}

.product-description {
	margin: 0 0 1rem 0;
}

.product-category-icon {
	vertical-align: middle;
	margin-right: .5rem;
}

.product-category {
	font-weight: 600;
	vertical-align: middle;
}

::v-deep(.product-list-item) {
	display: flex;
	align-items: center;
	padding: 1rem;
	width: 100%;

	img {
		width: 50px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin-right: 2rem;
	}

	.product-list-detail {
		flex: 1 1 0;
	}

	.p-rating {
		margin: 0 0 .5rem 0;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: .5rem;
		align-self: flex-end;
	}

	.product-list-action {
		display: flex;
		flex-direction: column;
	}

	.p-button {
		margin-bottom: .5rem;
	}
}

::v-deep(.product-grid-item) {
	margin: .5rem;
	border: 1px solid var(--surface-border);

	.product-grid-item-top,
	.product-grid-item-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	img {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin: 2rem 0;
	}

	.product-grid-item-content {
		text-align: center;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
	}
}

@media screen and (max-width: 576px) {
	.product-list-item {
		flex-direction: column;
		align-items: center;

		img {
			margin: 2rem 0;
		}

		.product-list-detail {
			text-align: center;
		}

		.product-price {
			align-self: center;
		}

		.product-list-action {
			display: flex;
			flex-direction: column;
		}

		.product-list-action {
			margin-top: 2rem;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 100%;
		}
	}
}
</style>