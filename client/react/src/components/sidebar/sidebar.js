export const Sidebar = ({ estaAbierto }) => {
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
        <img src="/icono.png" alt="aca va el icono del usuario" /> usuario
      </div>
    </div>
  );
};
