import { Link } from "react-router-dom"
import './ContenedorUsuario.css'


export const ContenedorUsuario = ({ user, logout }) => {
    const handleLogout = async () => {
        try {
            const res = logout && logout();
            if (res && typeof res.then === 'function') {
                await res;
            }
        } finally {
            window.location.reload(); //esto es para que borre el chat
        }
    };

    return (
        <div className="usuario-container">
            {user ? (
                <>
                    <img className="foto-usuario" src="/icono.png" alt="aca va el icono del usuario" />
                    <p>{user.name}</p>
                    <button onClick={handleLogout} className="boton-cerrar-sesion"><img className="icono-cerrar-sesion" src="/assets/cerrar-sesion.png" alt="icono de cerrar sesión" /></button>
                </>
            ) : (
                <><Link data-cy="iniciar-sesion" to="/auth/login" className="link-login">Iniciar sesión</Link></>
            )}
        </div>
    )
}