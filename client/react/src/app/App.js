import { RouteContextProvider } from '../data/RouteContextProvider';
import { AuthProvider } from '../data/AuthContext';
import './App.css';
import { AppRoutes } from '../routes';

function App() {
  return (
    <AuthProvider>
      <RouteContextProvider>
        <AppRoutes />
      </RouteContextProvider>
    </AuthProvider>
  )
}

export default App