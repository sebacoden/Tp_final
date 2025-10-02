import { useState } from "react";
import Chat from "../../features/chat/chat"
import { Header } from "../../components/header/header"
import { Sidebar } from "../../components/sidebar/sidebar"

export default function Layout () {
    const [estaAbierto, setEstaAbierto] = useState(false);


    function abrirSidebar() {
        setEstaAbierto(!estaAbierto);
    }

    function cerrarSidebar() {
        setEstaAbierto(false);
    }

    // Cierra el sidebar al hacer click fuera de él
    window.onclick = function(event) {
        if (!event.target.matches('.sidebar') && !event.target.matches('.btn-sidebar')) {
            cerrarSidebar();
        }
    }

    return (
      <main className="layout">
        <Header abrirSidebar={abrirSidebar} />
        <Sidebar estaAbierto={estaAbierto} />
        <Chat />
      </main>
    )
  }