export const MensajeTarjeta = ({ mensaje }) => {
  function claseMensaje() {
    return mensaje.tipo === "usuario" ? "usuario" : "asistente";
  }

  return (
    <div
      className={`mensaje ${claseMensaje()}`}
      dangerouslySetInnerHTML={{ __html: mensaje.contenido }}
    ></div>
  );
};
