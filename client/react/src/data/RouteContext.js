import { createContext } from 'react';

export const RouteContext = createContext({
  route: "",
  actualizarHeader: () => {}
});
