import { http } from "./Http"

export default {
    getUsuarios(){
        return http().get("/usuario");
    },
}