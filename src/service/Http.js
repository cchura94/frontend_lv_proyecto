import axios from 'axios'

export const urlBase = "http://127.0.0.1:8000/api";

export const http = () => {
    
    const interceptor = axios.create({
        baseURL: urlBase,
        headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json',
        },
        timeout: 30000
    });

    // captura de errores (401, 403)
    interceptor.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if(error.response.status === 401){
                window.location.href = "/login"
            }

            return Promise.reject(error);
        }
    )

    return interceptor;
}