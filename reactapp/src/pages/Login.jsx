import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login/', { username, password });
      localStorage.setItem('token', response.data.key); // Guarda el token
      navigate('/', { replace: true });
      console.log('Inicio de sesión exitoso');
      
    } catch (error) {
      //console.error('Error en el inicio de sesión');
      console.log('Error en el inicio de sesión')
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Nombre de usuario:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label><br />

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label><br />

      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}

