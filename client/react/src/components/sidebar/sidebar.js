export const Sidebar = ({ estaAbierto }) => {
  return (
    <div className={`sidebar ${estaAbierto ? "open" : ""}`}>
      <ul>
        <li>
          <a href="/auth/login">Iniciar sesión</a>
        </li>
        <li>
          <a href="/new">Nuevo chat</a>
        </li>
      </ul>
      <div className="usuario-container">
        <img src="/icono.png" alt="aca va el icono del usuario" /> usuario
      </div>
    </div>
  );
};
