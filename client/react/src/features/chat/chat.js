import { MensajeTarjeta } from "./components/mensajeTarjeta";
import { Mensaje } from "../../data/mensaje-domain";
import { chatService } from "../../data/services/chat-service";
import { useState } from "react";


export const Chat = () => {
  const [mensajeAEnviar, setMensajeAEnviar] = useState(new Mensaje())
  const [listaMensajes, setListaMensajes] = useState([])
  const [permiso, setPermiso] = useState(true)

  const enviarMensaje = async (e) => {
    e.preventDefault()
    setPermiso(false)
    chatService.preguntar(mensajeAEnviar.contenido).then((respuesta) => {
        const nuevoMensajeUsuario = new Mensaje(mensajeAEnviar.contenido, "usuario")
        const nuevoMensajeBot = new Mensaje(respuesta.data.natural_language_response, "asistente")
        setListaMensajes([...listaMensajes, nuevoMensajeUsuario, nuevoMensajeBot])
        limpiarInput()
        setPermiso(true)
        console.log("mensajes en el historial: ", listaMensajes)
        console.log("respuesta del bot: ", respuesta.data)
    }).catch((error) => {
        const nuevoMensajeUsuario = new Mensaje(mensajeAEnviar.contenido, "usuario")
        const nuevoMensajeBot = new Mensaje(error, "asistente")
        setListaMensajes([...listaMensajes, nuevoMensajeUsuario, nuevoMensajeBot])
        setPermiso(true)
    })
  }

  const actualizarInput = (valor) => {
    setMensajeAEnviar({
      ...mensajeAEnviar,
      contenido: valor
    }
    )
  }

  const limpiarInput = () => {
    setMensajeAEnviar(new Mensaje())
  }

  return (
    <section className="chat-container">
      <div className="chat-box">
        {listaMensajes.map((m) => (
          <MensajeTarjeta mensaje={m} />
        ))}
      </div>
      <form className="chat-form" onSubmit={enviarMensaje}>
        <input type="text" placeholder="Escribe tu mensaje..." value={mensajeAEnviar.contenido} onChange={(event) => actualizarInput(event.target.value)}/>
        <button type="submit"> {permiso ? "⟶" : "X"} </button>
      </form>
    </section>
  );
};

export default Chat;
