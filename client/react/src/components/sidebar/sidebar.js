import { useAuth } from "../../data/AuthContext";
import { ContenedorUsuario } from "../ContenedorUsuario/ContenedorUsuario";


export const Sidebar = ({ estaAbierto }) => {
  const { user, logout } = useAuth();
  return (
    <div className={`sidebar ${estaAbierto ? "open" : ""}`} data-cy="sidebar">
      <ul>
        <li data-cy="abrir-nuevo-chat">
          <a href="/new">Nuevo chat</a>
        </li>
      </ul>
      <ContenedorUsuario user={user} logout={logout} />
    </div>
  );
};
