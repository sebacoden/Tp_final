import { useState, useEffect } from 'react'
import './preferences.css'
import { useAuth } from '../../data/AuthContext'
import { guardarPreferencasService, obtenerPreferencasService } from '../../data/services/preferences-service'
import { Toast } from '../../components/Toast/Toast'

export const Preferences = ({ cerrarPreferencias }) => {
    const { user } = useAuth()
    const [guardando, setGuardando] = useState(false)
    const [cargando, setCargando] = useState(true)
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('exito')
    
    const [preferencias, setPreferencias] = useState({
        gluten: false,
        lactosa: false,
        vegano: false,
        vegetariano: false,
        mani: false,
        frutosSecos: false,
        mariscos: false,
        huevos: false,
        leche: false,
        soja: false,
        trigo: false,
    })

    // Cargar preferencias al abrir el componente
    useEffect(() => {
        const cargarPreferencias = async () => {
            if (!user?.email) return
            
            try {
                const response = await obtenerPreferencasService(user.email)
                if (response.preferencias && Object.keys(response.preferencias).length > 0) {
                    setPreferencias(prevState => ({
                        ...prevState,
                        ...response.preferencias
                    }))
                }
            } catch (err) {
                console.log('No hay preferencias guardadas o error al cargar:', err.message)
            } finally {
                setCargando(false)
            }
        }

        cargarPreferencias()
    }, [user?.email])

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target
        setPreferencias(prev => ({
            ...prev,
            [name]: checked
        }))
    }

    const handleGuardar = async (e) => {
        e.preventDefault()
        if (!user?.email) {
            setTipoMensaje('error')
            setMensaje('Error: Usuario no autenticado')
            return
        }

        try {
            setGuardando(true)
            setMensaje('')
            await guardarPreferencasService(user.email, preferencias)
            setTipoMensaje('exito')
            setMensaje('✓ Preferencias guardadas exitosamente')
            setTimeout(() => {
                cerrarPreferencias()
            }, 1500)
        } catch (err) {
            setTipoMensaje('error')
            setMensaje(`✗ Error: ${err.message}`)
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return (
            <div className='preferencias-block-screen' onClick={cerrarPreferencias}>
                <div className='preferencias-container' onClick={(e) => e.stopPropagation()}>
                    <p>Cargando preferencias...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Toast mensaje={mensaje} tipo={tipoMensaje} />
            <div className='preferencias-block-screen' onClick={cerrarPreferencias}>
                <form className='preferencias-container' onClick={(e) => e.stopPropagation()} onSubmit={handleGuardar}>
                <h2>Mis preferencias</h2>
                <div className='reestricciones-container'>
                    <h3>Restricciones alimentarias</h3>
                    <label>
                        <input type="checkbox" name="gluten" checked={preferencias.gluten} onChange={handleCheckboxChange} />Celiaco (sin gluten)
                    </label>
                    <label>
                        <input type="checkbox" name="lactosa" checked={preferencias.lactosa} onChange={handleCheckboxChange} />Intolerante a la lactosa
                    </label>
                    <label>
                        <input type="checkbox" name="vegano" checked={preferencias.vegano} onChange={handleCheckboxChange} />Vegano
                    </label>
                    <label>
                        <input type="checkbox" name="vegetariano" checked={preferencias.vegetariano} onChange={handleCheckboxChange} />Vegetariano
                    </label>
                </div>
                <div className='alergias-container'>
                    <h3>Alergias</h3>
                    <label>
                        <input type="checkbox" name="mani" checked={preferencias.mani} onChange={handleCheckboxChange} />Maní
                    </label>
                    <label>
                        <input type="checkbox" name="frutosSecos" checked={preferencias.frutosSecos} onChange={handleCheckboxChange} />Frutos secos
                    </label>
                    <label>
                        <input type="checkbox" name="mariscos" checked={preferencias.mariscos} onChange={handleCheckboxChange} />Mariscos
                    </label>
                    <label>
                        <input type="checkbox" name="huevos" checked={preferencias.huevos} onChange={handleCheckboxChange} />Huevos
                    </label>
                    <label>
                        <input type="checkbox" name="leche" checked={preferencias.leche} onChange={handleCheckboxChange} />Leche
                    </label>
                    <label>
                        <input type="checkbox" name="soja" checked={preferencias.soja} onChange={handleCheckboxChange} />Soja
                    </label>
                    <label>
                        <input type="checkbox" name="trigo" checked={preferencias.trigo} onChange={handleCheckboxChange} />Trigo
                    </label>
                </div>
                <div className='preferencias-botones'>
                    <button type="button" onClick={cerrarPreferencias} disabled={guardando}>Cancelar</button>
                    <button type='submit' disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
                </div>
            </form>
            </div>
        </>
    )
}