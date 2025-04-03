import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa 'react-dom/client' para React 18
import RoutesComponent from './Routes';

// Cambia la forma en que se renderiza la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));  // Crea el root

root.render(  // Usa 'render' en el root
  <React.StrictMode>
    <RoutesComponent />
  </React.StrictMode>
);
