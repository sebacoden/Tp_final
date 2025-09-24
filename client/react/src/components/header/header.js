export const Header = ({ abrirSidebar }) => {
    return (
        <header className="header">
            <img onClick={abrirSidebar} src="/logo.png"></img>
            <h1>Asistente de supermercado</h1>
        </header>
    )
}