import './Toast.css'
import { useEffect, useState } from 'react'

export const Toast = ({ mensaje, tipo, duracion = 3000 }) => {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (!mensaje) return

        setVisible(true)
        const timer = setTimeout(() => {
            setVisible(false)
        }, duracion)

        return () => clearTimeout(timer)
    }, [mensaje, duracion])

    if (!visible || !mensaje) return null

    return (
        <div className={`toast toast-${tipo}`}>
            {mensaje}
        </div>
    )
}
