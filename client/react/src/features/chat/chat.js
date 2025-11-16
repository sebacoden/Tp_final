import { useEffect, useState } from "react";
import { MensajeTarjeta } from "./components/mensajeTarjeta";
import { Mensaje } from "../../data/mensaje-domain";
import { chatService } from "../../data/services/chat-service";

export const Chat = () => {
  const [mensajeAEnviar, setMensajeAEnviar] = useState(new Mensaje());
  const [listaMensajes, setListaMensajes] = useState([]);
  const [esperarRespuesta, setEsperarRespuesta] = useState(true);

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    try {
      const respuesta = await chatService.obtenerMensajes();
      const mensajesBD = respuesta.data.messages.map(
        (m) => new Mensaje(m.contenido, m.tipo)
      );
      setListaMensajes(mensajesBD);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensajeAEnviar.contenido.trim()) return;

    setEsperarRespuesta(false);

    const nuevoMensajeUsuario = new Mensaje(
      mensajeAEnviar.contenido,
      "usuario"
    );
    setListaMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    limpiarInput();

    try {
      await chatService.preguntar(mensajeAEnviar.contenido);
      await cargarMensajes();
    } catch (error) {
      const mensajeError = new Mensaje(
        "Lo siento, estamos teniendo problemas conectando con el servidor.",
        "asistente"
      );
      setListaMensajes((prev) => [...prev, mensajeError]);
      console.error(error);
    } finally {
      setEsperarRespuesta(true);
    }
  };

  const actualizarInput = (valor) => {
    setMensajeAEnviar({
      ...mensajeAEnviar,
      contenido: valor,
    });
  };

  const limpiarInput = () => {
    setMensajeAEnviar(new Mensaje());
  };

  return (
    <section className="chat-container">
      <div className="chat-box" data-cy="caja-mensajes">
        {listaMensajes.map((m, i) => (
          <MensajeTarjeta key={i} mensaje={m} />
        ))}
      </div>
      <form className="chat-form" onSubmit={enviarMensaje}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={mensajeAEnviar.contenido}
          onChange={(event) => actualizarInput(event.target.value)}
          disabled={!esperarRespuesta}
          data-cy="mensaje-input"
        />
        <button type="submit">{esperarRespuesta ? "⟶" : "x"}</button>
      </form>
    </section>
  );
};

export default Chat;
