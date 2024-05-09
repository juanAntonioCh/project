import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
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
      console.log('Error en el inicio de sesión', error)
      setUserNameError(true)
      setPasswordError(true)
      console.log(e.target)
    }
  }

  return (
    <form className="form-container" onSubmit={handleLogin}>
      <div className="mb-3">
        <label htmlFor="validationCustom01" className="form-label">Nombre de usuario</label>
        <input type="text" className={`form-control ${usernameError ? 'is-invalid' : ''}`} id="validationCustom01" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <div className="invalid-feedback">
          {usernameError ? usernameError : 'Por favor, introduce un nombre de usuario válido.'}
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="validationCustom02" className="form-label">Contraseña</label>
        <input type="password" className={`form-control ${passwordError ? 'is-invalid' : ''}`} id="validationCustom02" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="invalid-feedback">
          {passwordError ? passwordError : 'Por favor, introduce una contraseña válida.'}
        </div>
      </div>
      <div className="form-action">
        <button className="btn btn-primary" type="submit">Iniciar Sesión</button>
      </div>
    </form>




  );
}

