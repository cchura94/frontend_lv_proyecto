<template>
  <h1>Registro</h1>

{{ usuario }}

  <input type="text" placeholder="Ingrese Nombre" v-model="usuario.name" required />
  <br />
  <input type="email" placeholder="Ingrese Correo" v-model="usuario.email" required />
  <br />
  <input type="password" placeholder="Ingrese Contraseña" v-model="usuario.password" required />
  <br />
  <input type="password" placeholder="Repita Contraseña" v-model="usuario.c_password" required />
  <br />
  <button @click="registrarse">REGISTRARSE</button>
</template>

<script>
import { ref } from "vue";
import authService from "@/service/auth.service.js";

export default {
  setup() {
    const usuario = ref({
      name: "",
      email: "",
      password: "",
      c_password: "",
    });

    const registrarse = async () => {
        const {data} = await authService.registro(usuario.value);
        console.log(data)
    }

    return { usuario, registrarse };
  },
};
</script>