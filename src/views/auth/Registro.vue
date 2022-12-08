<template>

{{ usuario }}
  <h1>Registro</h1>

  <input type="text" placeholder="Ingrese Nombre" v-model="usuario.name" required />
  {{ errores.name }}
  <br />
  <input type="email" placeholder="Ingrese Correo" v-model="usuario.email" required />
  {{ errores.email }}
  <br />
  <input type="password" placeholder="Ingrese Contraseña" v-model="usuario.password" required />
  {{ errores.password }}
  <br />
  <input type="password" placeholder="Repita Contraseña" v-model="usuario.c_password" required />
  {{ errores.c_password }}
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
    const errores = ref({});

    const registrarse = async () => {
      try{
        const {data} = await authService.registro(usuario.value);
        console.log(data)
        errores.value = {}

      }catch(error){
        console.log(error)
        errores.value = error.response.data.errors
        alert("Ocurrio un error al registrarse")
      }
    }

    return { usuario, errores, registrarse };
  },
};
</script>