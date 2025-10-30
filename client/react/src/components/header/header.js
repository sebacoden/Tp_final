export const Header = ({ abrirSidebar }) => {
  return (
    <header className="header">
      <img
        onClick={abrirSidebar}
        src="/logo.png"
        alt="aca va un logo"
        className="btn-sidebar"
        data-cy="btn-sidebar"
      ></img>
      <h1>Asistente de supermercado</h1>
    </header>
  );
};
