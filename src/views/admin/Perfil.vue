<template>
  <Card style="width: 25rem; margin-bottom: 2em">
    <template #title> Mi Perfil </template>
    <template #content>
      <div v-if="perfil">
        <h2>ID: {{ perfil.id }}</h2>
        <h2>NOMBRE: {{ perfil.name }}</h2>
        <h2>CORREO: {{ perfil.email }}</h2>
        <h2>{{ contador }}</h2>
      </div>
    </template>
  </Card>

  <div class="card">
    <h1>PINIA + (Vue api options)</h1>
    <h1>CONTADOR: {{ contador }} - {{ micontador.contador }} : {{ micontador.esParImpar }}</h1>
    <button @click="aumentar()">+</button>
    <button @click="reducir()">-</button>
    <hr>
    <button @click="micontador.aumentar">+</button>
    <button @click="micontador.reducir">-</button>
    <hr>
    <h1>{{ miStorePinia.usuario.usuario.email }}</h1>
  </div>

</template>

<script>
import { onMounted, ref } from "vue";
import authService from "@/service/auth.service";
import { useContadorStore } from '@/stores/contador.js'
import { useAuthStore } from '@/stores/auth.js'

export default {
  setup() {
    const micontador = useContadorStore()
    const miStorePinia = useAuthStore()

    const perfil = ref(null);
    const contador = ref(0);

    onMounted(async () => {
      const { data } = await authService.perfil();
      perfil.value = data;
    });

    const aumentar = () => {
      contador.value++;
    }

    const reducir = () => {
      contador.value--;
    }
    return { perfil, aumentar, reducir, contador, micontador, miStorePinia };
  },
};
</script>