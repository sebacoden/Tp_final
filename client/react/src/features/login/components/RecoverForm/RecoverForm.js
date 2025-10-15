import { useState } from 'react'
import '../../shared/FormStyle.css'
import './RecoverForm.css'
import { Link } from 'react-router-dom'

export const RecoverForm = () => {
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [okMsg, setOkMsg] = useState('')
    const [btnMsg, setBtnMsg] = useState('Enviar')

    const sleep = (ms) => new Promise(r => setTimeout(r, ms))
    
    const clearError = () => error && setError('')

    const validate = () => {
        if (!email) return 'El email es obligatorio'
        if (!/^\S+@\S+\.\S+$/.test(email)) return 'Ingresá un email válido'
        return ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setOkMsg('')
        const msg = validate()
        if (msg) { setError(msg); return }
        setBtnMsg('Enviando...')



        try {
            setSubmitting(true)
            // llamada al backend
            await sleep(1200)

            setOkMsg('Si el email está registrado, enviaremos un enlace para restablecer su contraseña')
            setError('')

        } finally {
            setBtnMsg('Enviado')
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container recover-form">
            <h2>Recuperar contraseña</h2>
            <div className='input-container'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value); clearError() }} data-cy='recover-email' required />
                <p id="email-error" className={`form-error ${error ? 'is-visible' : ''}`} data-cy='recover-error'>{error || '\u00A0'}</p>
                <p id="ok-msg" className={`ok-msg ${okMsg ? 'is-visible' : ''}`} data-cy='recover-success'>{okMsg || '\u00A0'}</p>  
            </div>
            <button type='submit' className={`form-btn ${submitting ? 'btn-disabled' : ''}`} data-cy='recover-submit' disabled={submitting}>{btnMsg}</button>
            <div className='auth-links'>
                <Link className='link' to='/auth/login' data-cy='recover-back-link' replace>Iniciar sesión</Link>
            </div>
        </form>
    )
}