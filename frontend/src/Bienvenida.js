import React from 'react';
import './styles/style.css';

function Bienvenida() {
  return (
    <div className="bienvenida-page">
      <nav className="navbar">
        <span className="navbar-text">¡Te damos la bienvenida!</span>
      </nav>

      <div className="logo-container">
        <img src="/logoU.png" alt="Logo" className="logo-image" />
      </div>
      <br/>
          <h1>¡Bienvenido!</h1>
          <br/>
          <p>Has iniciado sesión con éxito.</p>

    </div>
  );
}

export default Bienvenida;