import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/style.css';

function App() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInput = (input) => {
    const regex = /^[a-zA-Z0-9_]{3,30}$/;  // Solo permite caracteres seguros
    return regex.test(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de entradas antes de enviarlas
    if (!validateInput(usuario) || contrasena.length < 6) {
      setError('Usuario o contraseña no válidos.');
      return;
    }

    try {
      const response = await axios.post(
        'https://tu-servidor-seguro.com/backend/login.php', 
        { usuario, contrasena },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,  // Permite cookies seguras si el backend las usa
        }
      );

      if (response.data.status === 'success') {
        navigate('/bienvenida');
      } else {
        setError(response.data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Hubo un error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="login-input"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Iniciar sesión</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default App;
