import { Link } from "react-router-dom";
import { useAuth } from "../../data/AuthContext";


export const Sidebar = ({ estaAbierto }) => {
  const { user, logout } = useAuth();
  return (
    <div className={`sidebar ${estaAbierto ? "open" : ""}`} data-cy="sidebar">
      <ul>
        <li data-cy="iniciar-sesion">
          <a href="/auth/login">Iniciar sesión</a>
        </li>
        <li data-cy="abrir-nuevo-chat">
          <a href="/new">Nuevo chat</a>
        </li>
      </ul>
      <div className="usuario-container">
        {user ? (
          <div>
            <img src="/icono.png" alt="aca va el icono del usuario" />
            <p>{user.name}</p>
            <button onClick={logout} className="boton-cerrar-sesion"><img  src="/assets/cerrar-sesion.png" alt="icono de cerrar sesión" /></button>
          </div>
        ) : (
          <div><Link to="/auth/login" className="link-login">Iniciar sesión</Link></div>
        )}

      </div>
    </div>
  );
};
