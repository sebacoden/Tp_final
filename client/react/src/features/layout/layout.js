import { useState } from "react";
import Chat from "../../features/chat/chat"
import { Header } from "../../components/header/header"
import { Sidebar } from "../../components/sidebar/sidebar"

export default function Layout () {
    const [estaAbierto, setEstaAbierto] = useState(false);

    function abrirSidebar() {
        setEstaAbierto(!estaAbierto);
    }

    return (
      <main className="layout">
        <Header abrirSidebar={abrirSidebar} />
        <Sidebar Sidebar estaAbierto={estaAbierto} />
        <Chat />
      </main>
    )
  }