import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../data/AuthContext';

export const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    
    
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};