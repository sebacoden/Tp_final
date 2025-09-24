export const Sidebar = ({ estaAbierto }) => {
    return (
    <div className={`sidebar ${estaAbierto ? "open" : ""}`}>
        <ul>
        <li><a href="/home">Inicio</a></li>
        <li><a href="/new">Nuevo chat</a></li>
        </ul>
        <div className="usuario-container">usuario</div>
    </div>
    );
};
