import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Register.css'
import axios from 'axios';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
      });

      const response = await axios.post('http://localhost:8000/auth/login/', { username, password });
      localStorage.setItem('token', response.data.key); // Guardar el token 
      login()

      if (res.data != 'Usuario registrado correctamente') {
        console.log(res.data)
      } else {
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.error(error);
      
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Nombre de usuario:</label>
        <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Correo electrónico:</label>
        <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Contraseña:</label>
        <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-action">
        <button type="submit">Registrarse</button>
      </div>
    </form>
  );
}

