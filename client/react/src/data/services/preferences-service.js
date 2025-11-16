import { URL_SERVIDOR_REST } from '../../utils/configuracion'

const handleResponse = async (response) => {
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.detail || 'Error en la operación')
    }
    return data
}

export const guardarPreferencasService = async (email, preferencias) => {
    const response = await fetch(`${URL_SERVIDOR_REST}/preferences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, preferencias })
    })
    return handleResponse(response)
}

export const obtenerPreferencasService = async (email) => {
    const response = await fetch(`${URL_SERVIDOR_REST}/preferences/${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return handleResponse(response)
}
