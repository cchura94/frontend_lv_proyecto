import { http } from "./Http"

export default {
    getCliente(q=''){
        return http().get("/cliente?q="+q);
    },
    storeCliente(datos){
        return http().post("/cliente", datos);
    },
    mostrarCliente(id){
        return http().get("/cliente/"+id);
    },
    updateCliente(id, datos){
        return http().put("/cliente/"+id, datos);
    },
    deleteCliente(id){
        return http().delete("/cliente/"+id);
    },
}