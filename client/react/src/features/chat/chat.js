
export const Chat = () => {
    return (
        <section className = "chat-container">
            <div className = "chat-box">
                <div class="mensaje usuario">Quiero saber cuanto pan puedo comprar con $50</div>
                <div class="mensaje asistente">Como dos cuadraditas</div>
                <div class="mensaje usuario">Donde está el jabón en polvo</div>
                <div class="mensaje asistente">Fijate en el pasillo A sección B, apurate que queda muy poco en stock</div>
                <div class="mensaje usuario">Quiero comprar pan, carne y huevo con $20000</div>
                <div class="mensaje asistente">CUSTOM TEXT</div>
                <div class="mensaje usuario">Quiero saber cuanto pan puedo comprar con $50</div>
                <div class="mensaje asistente">Como dos cuadraditas</div>
                <div class="mensaje usuario">Donde está el jabón en polvo</div>
                <div class="mensaje asistente">Fijate en el pasillo A sección B, apurate que queda muy poco en stock</div>
                <div class="mensaje usuario">Quiero comprar pan, carne y huevo con $20000</div>
                <div class="mensaje asistente">CUSTOM TEXT</div>
            </div>
            <form className="chat-form">
                <input type="text" placeholder="Escribe tu mensaje..."/>
                <button type="submit"> -- </button>
            </form>
        </section>
    )
}

export default Chat