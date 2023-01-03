<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            class="p-button-success mr-2"
            @click="openNew"
          />
          <Button
            label="Eliminar"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>

        <template #end>
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="1000000"
            label="Importar"
            chooseLabel="Importar"
            class="mr-2 inline-block"
          />
          <Button
            label="Exportar"
            icon="pi pi-upload"
            class="p-button-help"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="products"
        :lazy="true"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="3"
        :filters="filters"
        :totalRecords="totalRecords"
        :loading="loading"
        @page="onPage($event)"
         @sort="onSort($event)"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} productos"
        responsiveLayout="scroll"
      >
        <template #header>
          <div
            class="
              table-header
              flex flex-column
              md:flex-row md:justiify-content-between
            "
          >
            <h5 class="mb-2 md:m-0 p-as-md-center">
              Adminisrar productos Products
            </h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="buscar"
                placeholder="Search..."
                @keyup.enter="buscarProductos()"
              />
            </span>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column
          field="id"
          header="ID"
          :sortable="true"
          style="min-width: 3rem"
        ></Column>
        <Column
          field="nombre"
          header="NOMBRE"
          :sortable="true"
          style="min-width: 16rem"
        ></Column>
        <Column header="Imagen">
          <template #body="slotProps">
            <img
              :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`"
              :alt="slotProps.data.imagen"
              class="product-image"
              width="20"
              height="20"
            />
            <a
              :href="`http://127.0.0.1:8000/${slotProps.data.imagen}`"
              target="_blank"
              >mostrar</a
            >
          </template>
        </Column>
        <Column
          field="precio"
          header="Precio"
          :sortable="true"
          style="min-width: 6rem"
        >
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.precio) }}
          </template>
        </Column>
        <Column
          field="categoria.nombre"
          header="Categoria"
          :sortable="false"
          style="min-width: 8rem"
        ></Column>
        <!--
                <Column field="rating" header="Reviews" :sortable="true" style="min-width:12rem">
                    <template #body="slotProps">
                       <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                    </template>
                </Column>
                -->
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="productDialog"
        :style="{ width: '450px' }"
        header="Product Details"
        :modal="true"
        class="p-fluid"
        v-if="product"
      >
        {{ product }}
        <div class="field">
          <label for="name">Nombre</label>
          <InputText
            id="name"
            v-model.trim="product.nombre"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.nombre }"
          />
          <small class="p-error" v-if="submitted && !product.nombre"
            >El nombre es requerido.</small
          >
          <!--{{ errors.errors.nombre }} -->
        </div>
        <div class="field">
          <label for="img">Imagen</label>
          <input type="file" @change="onImagenSeleccionada" />
        </div>
        <div class="field">
          <label for="descripcion">Descripción</label>
          <Textarea
            id="descripction"
            v-model="product.descripcion"
            required="true"
            rows="3"
            cols="20"
          />
        </div>
        <!--
            <div class="field">
				<label for="inventoryStatus" class="mb-3">Inventory Status</label>
				<Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
					<template #value="slotProps">
						<div v-if="slotProps.value && slotProps.value.value">
							<span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
						</div>
						<div v-else-if="slotProps.value && !slotProps.value.value">
							<span :class="'product-badge status-' +slotProps.value.toLowerCase()">{{slotProps.value}}</span>
						</div>
						<span v-else>
							{{slotProps.placeholder}}
						</span>
					</template>
				</Dropdown>
			</div>
            -->

        <div class="field">
          <label class="mb-3">Categoria</label>
          <div class="formgrid grid">
            <div
              class="field-radiobutton col-6"
              v-for="cat in categorias"
              :key="cat.id"
            >
              <RadioButton
                name="category"
                :value="cat.id"
                v-model="product.categoria_id"
              />
              <label for="category1">{{ cat.nombre }}</label>
            </div>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <label for="price">Precio</label>
            <InputNumber
              id="price"
              v-model="product.precio"
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
          <div class="field col">
            <label for="quantity">Cantidad</label>
            <InputNumber id="quantity" v-model="product.stock" integeronly />
          </div>
        </div>
        <template #footer>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveProduct"
          />
        </template>
      </Dialog>

      <!--

        <Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
            </template>
        </Dialog>
        -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import productoService from "./../../service/producto.service";
import categoriaService from "./../../service/categoria.service";

export default {
  setup() {
    onMounted(async () => {
      listarProductos();
      const { data } = await categoriaService.getCategorias();
      categorias.value = data;

      lazyParams.value = {
        first: 0,
        rows: 3,
        sortField: null,
        sortOrder: null,
        filters: filters.value,
      };
    });
    // variables

    const toast = useToast();
    const dt = ref();
    const products = ref();
    const categorias = ref();
    const productDialog = ref(false);
    const deleteProductDialog = ref(false);
    const deleteProductsDialog = ref(false);
    const product = ref({ nombre: "", descripcion: "" });
    const selectedProducts = ref();
    const totalRecords = ref(0);
    const loading = ref(true);
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const buscar = ref();
    const lazyParams = ref({});
    const submitted = ref(false);
    const statuses = ref([
      { label: "INSTOCK", value: "instock" },
      { label: "LOWSTOCK", value: "lowstock" },
      { label: "OUTOFSTOCK", value: "outofstock" },
    ]);
    const errors = ref([]);

    const formatCurrency = (value) => {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    };

    // metodos
    const listarProductos = async () => {
      console.log("Listando")
      loading.value = true;
      console.log(lazyParams.value)

       const {data}= await productoService.getProductos(lazyParams.value.page +1, buscar.value, lazyParams.value.sortField, lazyParams.value.rows)
       
          products.value = data.data;
          totalRecords.value = data.total;
          console.log(data);
          loading.value = false;
      
        
    };
    const buscarProductos = async () => {
        listarProductos()
    }

    const openNew = () => {
      product.value = {};
      submitted.value = false;
      productDialog.value = true;
    };
    const hideDialog = () => {
      productDialog.value = false;
      submitted.value = false;
    };
    const exportCSV = () => {
      dt.value.exportCSV();
    };
    const confirmDeleteProduct = (prod) => {
      product.value = prod;
      deleteProductDialog.value = true;
    };
    const confirmDeleteSelected = () => {
      deleteProductsDialog.value = true;
    };

    const deleteSelectedProducts = () => {
      products.value = products.value.filter(
        (val) => !selectedProducts.value.includes(val)
      );
      deleteProductsDialog.value = false;
      selectedProducts.value = null;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000,
      });
    };

    const onImagenSeleccionada = (event) => {
      console.log(event.target.files);
      product.value.imagen = event.target.files[0];
    };

    const onPage = (event) => {
      lazyParams.value = event;
      listarProductos();
    };

    const onSort = (event) => {
            lazyParams.value = event;
            listarProductos();
        };

    const saveProduct = async () => {
      try {
        // formData
        console.log(product.value);
        let fd = new FormData();
        fd.append("nombre", product.value.nombre);
        fd.append("precio", product.value.precio);
        fd.append("stock", product.value.stock);
        fd.append("descripcion", product.value.descripcion);
        fd.append("categoria_id", product.value.categoria_id);
        fd.append("imagen", product.value.imagen);

        const { data } = await productoService.storeProducto(fd);
        listarProductos();
        alert(data.mensaje);

        hideDialog();
      } catch (error) {
        errors.value = error.response.data;
        console.log("ERRORES: ", error.response.data);
        alert("Error al registrar el producto");
      }
    };

    // return variables o metodos
    return {
      openNew,
      confirmDeleteSelected,
      selectedProducts,
      exportCSV,
      hideDialog,
      productDialog,
      hideDialog,
      saveProduct,
      confirmDeleteProduct,
      deleteSelectedProducts,
      filters,
      statuses,
      formatCurrency,
      products,
      product,
      submitted,
      categorias,
      onImagenSeleccionada,
      errors,
      totalRecords,
      loading,
      onPage,
      onSort,
      buscar,
      buscarProductos
    };
  },
};
</script>

<style>
</style>