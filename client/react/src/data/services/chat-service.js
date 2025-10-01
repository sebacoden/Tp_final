import axios from "axios"
import { URL_SERVIDOR_REST } from "../../utils/configuracion"

class ChatService {
    async preguntar(mensaje) {
        return await axios.get(`${URL_SERVIDOR_REST}/ask`, { params: { question : mensaje } })
    }
}

export const chatService = new ChatService()