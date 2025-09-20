import Chat from "../../features/chat/chat"
import { Header } from "../../components/header/header"

export default function Layout () {
    return (
      <main>
        <Header />
        <Chat />
      </main>
    )
  }