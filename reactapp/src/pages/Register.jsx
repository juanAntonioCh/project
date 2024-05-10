import React, { useState, useContext, useEffect } from 'react';
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

  useEffect(() => {
    // Obtener todos los formularios para aplicarle las clases de Bootstrap
    const forms = document.querySelectorAll('.needs-validation');
    console.log('los formus son: ', forms);

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      }, false);
    });
  }, []);

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
    <form className="form-container needs-validation" noValidate onSubmit={handleSubmit}>

      <div className="form-group mb-4 position-relative">
        <label htmlFor="username" className="form-label">Nombre de usuario</label>
        <input type="text" className="form-control" id="username"
          value={username} onChange={(e) => setUsername(e.target.value)}
          required />
        <div className="valid-tooltip">
          Perfecto!
        </div>
        <div className="invalid-tooltip">
          Este campo es obligatorio
        </div>
      </div>

      <div className="form-group mb-3 position-relative">
        <label htmlFor="email" className="form-label">Correo electrónico</label>
        <input type="email" className="form-control"
          id="email"
          title="Ingresa un correo electrónico válido"
          value={email} onChange={(e) => setEmail(e.target.value)}
          required />
        <div className="valid-tooltip">
          Perfecto!
        </div>
        <div className="invalid-tooltip">
          Este campo es obligatorio
        </div>
      </div>

      <div className="form-group mb-4 position-relative">
        <label htmlFor="inputPassword5" className="form-label">Contraseña</label>
        <input type="password" id="inputPassword5" className="form-control" value={password}
          onChange={(e) => setPassword(e.target.value)}
          pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$" 
          title="La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra y un número"
          aria-describedby="passwordHelpBlock"
          required
        />
        <div id="passwordHelpBlock" className="form-text"></div>
        <div className="valid-tooltip">
          Perfecto!
        </div>
        <div className="invalid-tooltip">
          Este campo es obligatorio
        </div>
      </div>

      <div className="form-action">
        <button type="submit">Registrarse</button>
      </div>
    </form>
  );
}

