import { http } from "./Http"

export default {
    getProductos(page=1, q='', orden='id', rows=3){
        // const queryParams = parametros ? Object.keys(parametros).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(parametros[k])).join('&') : '';
        if(q){
                return http().get(`/producto?page=${page}&q=${q}&orden=${orden}&rows=${rows}`);
           
            // return http().get(`/producto?page=${page}&q=${q}`);
        }else{
            return http().get(`/producto?page=${page}&orden=${orden}&rows=${rows}`);
        }
    },
    storeProducto(datos){
        return http().post("/producto", datos);
    },
    mostrarProducto(id){
        return http().get("/producto/"+id);
    },
    updateProducto(id, datos){
        return http().put("/producto/"+id, datos);
    },
    deleteProducto(id){
        return http().delete("/producto/"+id);
    },
}