import { useState } from 'react'
import './LoginForm.css'
import { Link, useNavigate } from 'react-router-dom'

export const LoginForm = ({ onSuccess }) => {

    const navigate = useNavigate()
    // para testear validaciones

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const testUser = {
        email: 'test@email.com',
        password: '1234',
        name: 'usuario de tests'
    }

    // esto deberia pegarle al service en un futuro
    const handleSubmit = (e) => {
        e.preventDefault()

        if (email === testUser.email && password === testUser.password) {
            //setear estado global de usuario logeado
            //este console log es para mostrar que se logeo, luego se eliminara
            console.log('Bienvenido ' + testUser.name)
            onSuccess?.()
        } else {
            setError('Email o contraseña incorrectos')
        }
    }

    const handleFieldInput = (setter) => (e) => {
        setter(e.target.value);
        if (error) setError('');
    };


    return (
        <form onSubmit={handleSubmit} className='login-form-container'>
            <h2>Iniciar Sesión</h2>
            <div className='input-container'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' placeholder='Email' value={email} onChange={handleFieldInput(setEmail)} required />
            </div>
            <div className='input-container'>
                <label htmlFor='password'>Contraseña</label>
                <input type='password' id='password' placeholder='Contraseña' value={password} onChange={handleFieldInput(setPassword)} required />
                <p id="form-error" className={`form-error ${error ? 'is-visible' : ''}`}>{error || '\u00A0'}</p>
            </div>
            <button type='submit'>Ingresar</button>
            <div className='auth-links'>
                <Link className='link' to='/auth/recover'>¿Olvidaste tu contraseña?</Link>
                <Link className='link' to='/auth/register'>Crear cuenta</Link>
            </div>
        </form>
    )
}