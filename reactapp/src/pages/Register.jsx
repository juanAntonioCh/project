import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Register.css'
import axios from 'axios';
import { LogoSvg } from '../components/LogoSvg';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setError(null);
  };

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [error]);

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

      if (res.data == 'Usuario registrado correctamente') {
        const response = await axios.post('http://localhost:8000/auth/login/', { username, password });
        localStorage.setItem('token', response.data.key); // Guardar el token 
        login()
        navigate('/', { replace: true });

      } else {
        console.log(res.data)
        setError(res.data)
      }

    } catch (error) {
      console.error(error);

    }
  };

  return (
    <>
      <div className="register-body">
        {error && (
          <div className="alert-container">
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>{error}</strong>
              <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
            </div>
          </div>
        )}
        <div className='container'>
          <div className="row pt-5">
            <div className="col-lg-6 d-none d-lg-block register-image">
            </div>

            <div className="col-12 col-lg-6 bg-white">

              <form className="form-container needs-validation p-4" noValidate onSubmit={handleSubmit}>
                <div className="text-end">
                  <LogoSvg width={'100px'} height={'100px'} />
                </div>
                <h1 className="mb-5 pt-4 text-center fs-3 fw-bold">¡Pon tu coche a trabajar!</h1>

                <div className="form-group mb-4 position-relative">
                  <label htmlFor="username" className="form-label">Nombre de usuario</label>
                  <input type="text" className="form-control" id="username"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    required />
                  {!error && (
                    <div className="valid-tooltip">
                      Perfecto!
                    </div>
                  )}
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
                  {!error && (
                    <div className="valid-tooltip">
                      Perfecto!
                    </div>
                  )}
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
                  {!error && (
                    <div className="valid-tooltip">
                      Perfecto!
                    </div>
                  )}
                  <div className="invalid-tooltip">
                    Este campo es obligatorio
                  </div>
                </div>

                <div className="form-action">
                  <button className="btn btn-primary w-100 mb-3" type="submit">Registarse</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

