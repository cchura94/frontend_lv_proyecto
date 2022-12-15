import { http } from "./Http"

export default {
    loginConLaravel(datos) {
        // http().get("../sanctum/csrf-cookie").then( async () => {
            return http().post("/v1/auth/login", datos);
        // })
    },
    registro(datos){
        return http().post("/v1/auth/registro", datos);
    },
    perfil(){
        return http().get("/v1/auth/perfil");
    },
    salir(){
        return http().post("/v1/auth/logout");
    }
}