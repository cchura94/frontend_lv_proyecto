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
                  :src="`http://127.0.0.1:8000${slotProps.data.imagen}`"
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
                    label="Add to Cart"
                    :disabled="slotProps.data.estado === 1"
                  ></Button>
                  <span
                    :class="
                      'product-badge status-' +
                      slotProps.data.estado.toLowerCase()
                    "
                    >{{ slotProps.data.estado }}</span
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
            <h5>Carrito pruebsw</h5>
          </div>
        </div>
        <div class="col-12">
          <div class="card">
            <h5>Cliente</h5>
          </div>
        </div>
        <div class="col-12">
          <div class="card">
            <h5>Detalle</h5>
          </div>
        </div>
        <div class="col-12">
          <div class="card">
            <Button label="Registrar Pedido" icon="pi pi-check" class="block" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import productoService from "@/service/producto.service";

export default {
    setup() {

        onMounted(() => {
            listarProductos()
        })

        const productos = ref([])
        const layout = ref('grid');
        const sortKey = ref();
        const sortOrder = ref();
        const sortField = ref();
        const sortOptions = ref([
            {label: 'Price High to Low', value: '!price'},
            {label: 'Price Low to High', value: 'price'},
        ]);

        const listarProductos = () => {
            const {data} = await productoService.getProductos()
            productos.value = data.data
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
            productos, layout, sortKey, sortOrder, sortField, sortOptions, onSortChange
        }

        
    },
}
</script>