<template>
  <Card style="width: 25rem; margin-bottom: 2em">
    <template #title> Mi Perfil </template>
    <template #content>
      <div v-if="perfil">
        <h2>ID: {{ perfil.id }}</h2>
        <h2>NOMBRE: {{ perfil.name }}</h2>
        <h2>CORREO: {{ perfil.email }}</h2>
      </div>
    </template>
  </Card>
</template>

<script>
import { onMounted, ref } from "vue";
import authService from "@/service/auth.service";

export default {
  setup() {
    const perfil = ref(null);

    onMounted(async () => {
      const { data } = await authService.perfil();
      perfil.value = data;
    });

    return { perfil };
  },
};
</script>