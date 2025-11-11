import { useState } from "react";
import Chat from "../../features/chat/chat"
import { Header } from "../../components/header/header"
import { Sidebar } from "../../components/sidebar/sidebar"
import { Preferences } from "../preferences/preferences";

export default function Layout () {
    const [estaAbierto, setEstaAbierto] = useState(false);
    const [preferenciasMenu, setPreferenciasMenu] = useState(false)


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
        <Sidebar estaAbierto={estaAbierto} abrirPreferencias={()=>setPreferenciasMenu(true)} />
        <Chat />
        {preferenciasMenu && (<Preferences cerrarPreferencias={() => setPreferenciasMenu(false)} />)}
      </main>
    )
  }