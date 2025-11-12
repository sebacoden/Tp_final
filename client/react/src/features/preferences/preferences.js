import './preferences.css'

export const Preferences = ({ cerrarPreferencias }) => {
    return (
        <div className='preferencias-block-screen' onClick={cerrarPreferencias}>
            <form className='preferencias-container' onClick={(e) => e.stopPropagation()}>
                <h2>Mis preferencias</h2>
                <div className='reestricciones-container'>
                    <h3>Restricciones alimentarias</h3>
                    <label>
                        <input type="checkbox" name="gluten" />Celiaco (sin gluten)
                    </label>
                    <label>
                        <input type="checkbox" name="lactosa" />Intolerante a la lactosa
                    </label>
                    <label>
                        <input type="checkbox" name="vegano" />Vegano
                    </label>
                    <label>
                        <input type="checkbox" name="vegetariano" />Vegetariano
                    </label>
                </div>
                <div className='alergias-container'>
                    <h3>Alergias</h3>
                    <label>
                        <input type="checkbox" name="mani" />Maní
                    </label>
                    <label>
                        <input type="checkbox" name="frutos-secos" />Frutos secos
                    </label>
                    <label>
                        <input type="checkbox" name="mariscos" />Mariscos
                    </label>
                    <label>
                        <input type="checkbox" name="huevos" />Huevos
                    </label>
                    <label>
                        <input type="checkbox" name="leche" />Leche
                    </label>
                    <label>
                        <input type="checkbox" name="soja" />Soja
                    </label>
                    <label>
                        <input type="checkbox" name="trigo" />Trigo
                    </label>
                </div>
                <div className='preferencias-botones'>
                    <button onClick={cerrarPreferencias}>Cancelar</button>
                    <button type='submit' onClick={cerrarPreferencias}>Guardar</button>
                </div>
            </form>
        </div>
    )
}