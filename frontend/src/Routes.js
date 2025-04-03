import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
import Bienvenida from './Bienvenida';

function RoutesComponent() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<App />} /> 
        <Route path="/bienvenida" element={<Bienvenida />} /> 
        <Route path="/login" element={<App />} />  
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
