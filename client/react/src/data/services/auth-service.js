import { URL_SERVIDOR_REST } from '../../utils/configuracion'

const handleResponse = async (response) => {
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.detail || 'Error en la operación')
    }
    return data
}

export const loginService = async (email, password) => {
    const response = await fetch(`${URL_SERVIDOR_REST}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
}

export const registerService = async (email, name, password) => {
    const response = await fetch(`${URL_SERVIDOR_REST}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password })
    })
    return handleResponse(response)
}

export const verifyEmailService = async (email) => {
    const response = await fetch(`${URL_SERVIDOR_REST}/recover/verify-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    })
    return handleResponse(response)
}