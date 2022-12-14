import { http } from "./Http"

export default {
    getUsuarios(){
        return http().get("/usuario");
    },

    storeUsuario(datos){
        return http().post("/usuario", datos);
    }
}