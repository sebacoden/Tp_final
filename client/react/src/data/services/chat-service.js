import axios from "axios";
import { URL_SERVIDOR_REST } from "../../utils/configuracion";

class ChatService {
    async preguntar(mensaje) {
        return await axios.post(`${URL_SERVIDOR_REST}/ask`, { question: mensaje });
    }

    async obtenerMensajes() {
        return await axios.get(`${URL_SERVIDOR_REST}/messages`);
    }

    async borrarMensajes() {
        return await axios.delete(`${URL_SERVIDOR_REST}/messages`);
    }
}

export const chatService = new ChatService();
