import { useState } from 'react'
import './LoginForm.css'
import '../../shared/FormStyle.css'
import { Link } from 'react-router-dom'

export const LoginForm = ({ onSuccess }) => {

    // para testear validaciones

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [submitting, setSubmitting] = useState('')

    const testUser = {
        email: 'test@email.com',
        password: '1234',
        name: 'usuario de tests'
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (email !== testUser.email || password !== testUser.password) { setError('Email o contraseña incorrectos'); return }
        try {
            setSubmitting(true)
            //llamada al backend
            await sleep(2000);
            onSuccess?.()
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleFieldInput = (setter) => (e) => {
        setter(e.target.value);
        if (error) setError('');
    };

    const handleShowPwd = () => setShowPwd(!showPwd)


    return (
        <form onSubmit={handleSubmit} className='form-container login-form'>
            <h2>Iniciar Sesión</h2>
            <div className='input-container'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' placeholder='Email' value={email} onChange={handleFieldInput(setEmail)} data-cy="login-email" required />
            </div>
            <div className='input-container'>
                <label htmlFor='password'>Contraseña</label>
                <input type={showPwd ? 'text' : 'password'} id='password' placeholder='Contraseña' value={password} onChange={handleFieldInput(setPassword)} data-cy="login-password" required />
                <button type='button' className='pass-btn' tabIndex={-1} onClick={handleShowPwd}>{showPwd ? '🙉' : '🙈'} </button>
                <p id="form-error" data-cy="login-error" className={`form-error ${error ? 'is-visible' : ''}`}>{error || '\u00A0'}</p>
            </div>
            <button type='submit' className={`form-btn ${submitting ? 'btn-disabled' : ''}`} disabled={submitting} data-cy="login-submit">{submitting ? 'Ingresando...' : 'Ingresar'}</button>
            <div className='auth-links'>
                <Link className='link' to='/auth/recover' data-cy='login-recover-link'>¿Olvidaste tu contraseña?</Link>
                <Link className='link' to='/auth/register' data-cy='login-register-link'>Crear cuenta</Link>
            </div>
        </form>
    )
}