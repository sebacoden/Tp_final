import { RouteContextProvider } from '../data/RouteContextProvider';
import './App.css';
import { AppRoutes } from '../routes';

function App() {

  return (
    <RouteContextProvider>
      <AppRoutes />
    </RouteContextProvider>
  )
}

export default App