import { useState } from 'react';
import { RouteContext } from './RouteContext';

export const RouteContextProvider = ({ children }) => {
  const [ruta, setRuta] = useState("");

  const value = {
    ruta,
    actualizarHeader: (newRoute) => {
      setRuta(newRoute);
    }
  };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
};
