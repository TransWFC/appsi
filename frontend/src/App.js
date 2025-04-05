import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/style.css';

function App() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update validation to check for a valid email format
  const validateInput = (input) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Email regex
    return regex.test(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInput(usuario)) {
      setError('Correo electrónico no válido');
      return;
    }

    try {
      console.log("Enviando:", { usuario, contrasena });

      const response = await axios.post(
        '/api/login.php',
        JSON.stringify({ usuario, contrasena }),  // <-- fuerza a JSON válido
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false  // <-- prueba quitando credenciales
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
          type="email"  // Change input type to "email"
          className="login-input"
          placeholder="Correo electrónico"
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
