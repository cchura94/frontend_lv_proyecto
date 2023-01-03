import { http } from "./Http"

export default {
    getPedidos(page=1, q='', orden='id', rows=3){
        // const queryParams = parametros ? Object.keys(parametros).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(parametros[k])).join('&') : '';
        if(q){
                return http().get(`/pedido?page=${page}&q=${q}&orden=${orden}&rows=${rows}`);
           
            // return http().get(`/pedido?page=${page}&q=${q}`);
        }else{
            return http().get(`/pedido?page=${page}&orden=${orden}&rows=${rows}`);
        }
    },
    storePedido(datos){
        return http().post("/pedido", datos);
    },
    mostrarPedido(id){
        return http().get("/pedido/"+id);
    },
    updatePedido(id, datos){
        return http().put("/pedido/"+id, datos);
    },
    deletePedido(id){
        return http().delete("/pedido/"+id);
    },
}