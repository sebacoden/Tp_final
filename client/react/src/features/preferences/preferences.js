import './preferences.css'

export const Preferences = ({ cerrarPreferencias }) => {
    return (
        <div className='preferencias-block-screen' onClick={cerrarPreferencias}>
            <div className='preferencias-container' onClick={(e) => e.stopPropagation()}>
                <h2>User Preferences</h2>
                <p>Here you can set your preferences.</p>
                <button onClick={cerrarPreferencias}>Close</button>
            </div>
        </div>
    )
}