import { MensajeTarjeta } from "./components/mensajeTarjeta"
import { Mensaje } from "../../data/mensaje-domain"

export const Chat = () => {
    var temporalListadoMensajes = [
        new Mensaje("Quiero saber cuanto pan puedo comprar con $50", "usuario"),
        new Mensaje("Como dos cuadraditas", "asistente"),
        new Mensaje("Donde está el jabón en polvo", "usuario"),
        new Mensaje("Fijate en el pasillo A sección B, apurate que queda muy poco en stock", "asistente"),
        new Mensaje("Quiero comprar pan, carne y huevo con $20000", "usuario"),
        new Mensaje("CUSTOM TEXT", "asistente"),
    ]
    return (
        <section className = "chat-container">
            <div className = "chat-box">
                {temporalListadoMensajes.map((m) => (
                    <MensajeTarjeta mensaje={m}/>
                ))}
            </div>
            <form className="chat-form">
                <input type="text" placeholder="Escribe tu mensaje..."/>
                <button type="submit"> ⟶ </button>
            </form>
        </section>
    )
}

export default Chat