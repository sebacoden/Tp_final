import { MensajeTarjeta } from "./components/mensajeTarjeta";
import { Mensaje } from "../../data/mensaje-domain";
import { chatService } from "../../data/services/chat-service";
import { useState } from "react";
import { useOnInit } from "../../data/useOnInIt";


export const Chat = () => {
  const [mensajeAEnviar, setMensajeAEnviar] = useState(new Mensaje())
  const [listaMensajes, setListaMensajes] = useState([])

  const obtenerMensajes = async () => {
    console.log("mensajeAEnviar: ", mensajeAEnviar)
    chatService.obtenerTodos().then((mensajes) => {
      setListaMensajes(mensajes.data)
    }).catch((error) => {
      console.error("An error has Okuu'd: ", error)
    })
  }



  const enviarMensaje = async (e) => {
    e.preventDefault()
    console.log("mensajeAEnviar: ", mensajeAEnviar)
    await chatService.enviar(mensajeAEnviar).then((respuesta) => {
      console.log("Mensaje enviado: ", respuesta.data)
      limpiarInput()
      obtenerMensajes()
    }).catch((error) => {
      console.error(mensajeAEnviar)
    })
  }
  
  useOnInit(() => {
    obtenerMensajes()
  })

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

        <button type="submit"> ⟶ </button>
      </form>
    </section>
  );
};

export default Chat;
