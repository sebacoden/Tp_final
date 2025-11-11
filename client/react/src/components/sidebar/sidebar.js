import { useAuth } from "../../data/AuthContext";
import { ContenedorUsuario } from "../ContenedorUsuario/ContenedorUsuario";
import { chatService } from "../../data/services/chat-service";

export const Sidebar = ({ estaAbierto, abrirPreferencias }) => {
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
          <a onClick={borrarMensajes} >Nuevo chat</a>
        </li>
      </ul>

      <div className="sidebar-usuario">
        {user && (<button className="preferencias-btn" onClick={abrirPreferencias}>Preferencias de consumo</button>)}
        <ContenedorUsuario user={user} logout={logout} />
      </div>
    </div>
  );
};
