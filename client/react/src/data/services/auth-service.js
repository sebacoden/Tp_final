import axios from 'axios'
import { URL_SERVIDOR_REST } from '../../utils/configuracion'

const handleResponse = (response) => {
  return response.data
}

const handleError = (error) => {
  const detail = error.response?.data?.detail || 'Error en la operación'
  throw new Error(detail)
}

export const loginService = async (email, password) => {
  try {
    const response = await axios.post(`${URL_SERVIDOR_REST}/login`, { email, password })
    return handleResponse(response)
  } catch (error) {
    handleError(error)
  }
}

export const registerService = async (email, name, password) => {
  try {
    const response = await axios.post(`${URL_SERVIDOR_REST}/register`, { email, name, password })
    return handleResponse(response)
  } catch (error) {
    handleError(error)
  }
}

export const verifyEmailService = async (email) => {
  try {
    const response = await axios.post(`${URL_SERVIDOR_REST}/recover/verify-email`, { email })
    return handleResponse(response)
  } catch (error) {
    handleError(error)
  }
}
