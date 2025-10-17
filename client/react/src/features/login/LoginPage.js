import { Navigate, useNavigate, useParams } from "react-router-dom"
import { LoginForm } from "./components/LoginForm/LoginForm"
import { RegisterForm } from "./components/RegisterForm/RegisterForm"
import { RecoverForm } from "./components/RecoverForm/RecoverForm"
import './LoginPage.css'


export const LoginPage = () =>{
    const navigate = useNavigate()
    const {mode} = useParams()

    const validModes = ['login','register','recover']

    if(!validModes.includes(mode)){
        return <Navigate to='/auth/login' replace/>
    }
    
    const handleSuccess = () => navigate('/', { replace: true })

    return (
        <div className='login-page-container'>
            {mode === 'login' && <LoginForm onSuccess={handleSuccess}/>}
            {mode === 'register' && <RegisterForm onSuccess={handleSuccess}/>}
            {mode === 'recover' && <RecoverForm onSuccess={()=> navigate('/auth/login', {replace:true})}/>}
        </div>
    )
}