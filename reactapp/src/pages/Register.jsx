import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/ConectaCar/register/', {
        username,
        email,
        password,
      });

      if (res.data != 'Usuario registrado correctamente') {
        console.log(res.data)
      } else {
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.error(error);
      // Manejar errores, como mostrar mensajes de error en el formulario
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Nombre de usuario:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Correo electrónico:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-action">
        <button type="submit">Registrarse</button>
      </div>
    </form>
  );
}

