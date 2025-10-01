import axios from "axios"
import { URL_SERVIDOR_REST } from "../../utils/configuracion"

class ChatService {
    async obtenerTodos() {
        return axios.get(`${URL_SERVIDOR_REST}/mensajes`)
    }

    async enviar(mensaje) {
        return axios.post(`${URL_SERVIDOR_REST}/mensajes/enviar`,mensaje)
    }

    async recibir() {
        return axios.get(`${URL_SERVIDOR_REST}/mensajes/recibir`)
    }        
}

export const chatService = new ChatService()