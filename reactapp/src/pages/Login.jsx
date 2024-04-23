import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login/', { username, password });
      localStorage.setItem('token', response.data.key); // Guardar el token 
      login()
      console.log('Inicio de sesión exitoso');
      navigate('/', { replace: true });

    } catch (error) {
      //console.error('Error en el inicio de sesión');
      console.log('Error en el inicio de sesión')
    }
  }

  return (
    <form className="form-container" onSubmit={handleLogin}>
      <div className="form-field">
        <label>Nombre de usuario:</label>
        <input
          type="text"
          value={username}
          className="form-control"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-action">
        <button type="submit">Iniciar Sesión</button>
      </div>
    </form>

  );
}

