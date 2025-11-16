import { useState } from "react"
import { Link } from "react-router-dom"
import '../../shared/FormStyle.css'
import './RegisterForm.css'
import { registerService } from '../../../../data/services/auth-service'
import { useAuth } from '../../../../data/AuthContext'


export const RegisterForm = ({onSuccess}) =>{
    
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [password2,setPassword2] = useState('')
    const [submitting,setSubmitting] = useState('')
    const [showPwd,setShowPwd] = useState(false)


    const [errors,setErrors] = useState({
        email:'',
        pwd:'',
        pwd2:''
    })

    const clearFieldError = (field) => setErrors((e) => ({ ...e, [field]: '' }))

    const validate = () => {
        const next ={email:'',pwd:'',pwd2:''}
        if(!email) next.email = 'El email es obligatorio'
        else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Ingresá un email válido'
        
        if(!password) next.pwd = 'La contraseña es obligatoria'
        else if(password.length < 8) next.pwd = 'Debe tener al menos 8 caracteres'

        if(!password2) next.pwd = 'Confirmá tu contraseña'
        else if (password2 !== password) next.pwd2 = 'Las contraseñas no coinciden'

        setErrors(next)
        return Object.values(next).every((msg)=>msg==='')
    }

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!validate()) return

        try {
            setSubmitting(true)
            await registerService(email, name, password)
            login({ email, name }) // Iniciar sesión automáticamente después del registro
            onSuccess?.()
        } catch (err) {
            setErrors(prev => ({ ...prev, email: err.message }))
        } finally {
            setSubmitting(false)
        }
    }

    const handleShowPwd = () => setShowPwd(!showPwd)

    return(
        <form onSubmit={handleSubmit} className='form-container register-form'>
            <h2>Crear cuenta</h2>
            <div className='input-container'>
                <label htmlFor='name'>Nombre</label>
                <input type='text' id='name' placeholder='Nombre' value={name} onChange={ (e) => {setName(e.target.value)}} data-cy='register-name' required />
            </div>
            <div className='input-container'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) clearFieldError('email') }} data-cy='register-email' required />
                <p id="email-error" className={`form-error email-error ${errors.email ? 'is-visible' : ''}` } data-cy='register-error-email'>{errors.email || '\u00A0'}</p> 
            </div>
            <div className='input-container'>
                <label htmlFor='password'>Contraseña</label>
                <input type={showPwd ? 'text':'password'} id='password' placeholder='Contraseña' value={password} onChange={(e) => { setPassword(e.target.value); if (errors.pwd) clearFieldError('pwd') }} data-cy='register-password' required />
                <button type='button' className='pass-btn' tabIndex={-1} onClick={handleShowPwd}>{showPwd ? '🙉':'🙈'}</button>
                <p id="password-error" className={`form-error password-error ${errors.pwd ? 'is-visible' : ''}`} data-cy='register-error-pwd'> {errors.pwd || '\u00A0'} </p>
            </div>
            <div className='input-container'>
                <label htmlFor='confirmPass'>Confirmar contraseña</label>
                <input type={showPwd ? 'text':'password'} id='confirmPass' placeholder='Confirmar contraseña' value={password2} onChange={(e) => { setPassword2(e.target.value); if (errors.pwd2) clearFieldError('pwd2') }} data-cy='register-password2' required />
                <button type='button' className='pass-btn' tabIndex={-1} onClick={handleShowPwd}>{showPwd ? '🙉':'🙈'}</button>
                <p id="password2-error" className={`form-error password2-error ${errors.pwd2 ? 'is-visible' : ''}`} data-cy='register-error-pwd2'>{errors.pwd2 || '\u00A0'}</p>
            </div>
            <button type='submit' className={`form-btn ${submitting ? 'btn-disabled' : ''}`} disabled={submitting} data-cy='register-submit'>{submitting ? 'Procesando...' : 'Registrarse'}</button>
            <div className='auth-links'>
                <Link className='link' to='/auth/login' data-cy='register-back-link' replace>Ya tengo cuenta</Link>
            </div>
        </form>
    )
}