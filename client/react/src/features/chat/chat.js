import { MensajeTarjeta } from "./components/mensajeTarjeta";
import { Mensaje } from "../../data/mensaje-domain";
import { chatService } from "../../data/services/chat-service";
import { useState } from "react";


export const Chat = () => {
  const [mensajeAEnviar, setMensajeAEnviar] = useState(new Mensaje())
  const [listaMensajes, setListaMensajes] = useState([])
  const [esperarRespuesta, setEsperarRespuesta] = useState(true)

  const enviarMensaje = async (e) => {
    e.preventDefault()
    setEsperarRespuesta(false)

    const nuevoMensajeUsuario = new Mensaje(mensajeAEnviar.contenido, "usuario")
    setListaMensajes(prev => [...prev, nuevoMensajeUsuario])
    limpiarInput()

    chatService.preguntar(mensajeAEnviar.contenido).then((respuesta) => {
        const nuevoMensajeBot = new Mensaje(respuesta.data.natural_language_response, "asistente")
        setListaMensajes(prev => [...prev, nuevoMensajeBot])

        setEsperarRespuesta(true)
    }).catch((error) => {
        const mensajeError = new Mensaje("Lo siento, estamos teniendo problemas conectando con el servidor.", "asistente")
        setListaMensajes(prev => [...prev, mensajeError])

        setEsperarRespuesta(true)
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
      <div className="chat-box" data-cy="caja-mensajes">
        {listaMensajes.map((m) => (
          <MensajeTarjeta mensaje={m} />
        ))}
      </div>
      <form className="chat-form" onSubmit={enviarMensaje}>
        <input type="text" placeholder="Escribe tu mensaje..." value={mensajeAEnviar.contenido} onChange={(event) => actualizarInput(event.target.value)} disabled={!esperarRespuesta} data-cy="mensaje-input"/>
        <button type="submit"> {esperarRespuesta ? "⟶" : "x"} </button>
      </form>
    </section>
  );
};

export default Chat;
