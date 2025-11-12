import { useAuth } from "../../data/AuthContext";
import { ContenedorUsuario } from "../ContenedorUsuario/ContenedorUsuario";
import { chatService } from "../../data/services/chat-service";

export const Sidebar = ({ estaAbierto }) => {
  const { user, logout } = useAuth();
  
  const borrarMensajes = async () => {
    try {
      await chatService.borrarMensajes();
      window.location.reload();
    } catch (error) {
      console.error("Error al borrar mensajes:", error);
    }
  }

  return (
    <div className={`sidebar ${estaAbierto ? "open" : ""}`} data-cy="sidebar">
      <ul>
        <li data-cy="abrir-nuevo-chat">
          <a onClick={borrarMensajes} >Limpiar chat</a>
        </li>
      </ul>
      <ContenedorUsuario user={user} logout={logout} />
    </div>
  );
};
