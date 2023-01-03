import { http } from "./Http"

export default {
    getCategorias(){
        return http().get("/categoria");
    },
    storeCategoria(datos){
        return http().post("/categoria", datos);
    },
    mostrarCategoria(id){
        return http().get("/categoria/"+id);
    },
    updateCateogoria(id, datos){
        return http().put("/categoria/"+id, datos);
    },
    deleteCategoria(id){
        return http().delete("/categoria/"+id);
    },
}