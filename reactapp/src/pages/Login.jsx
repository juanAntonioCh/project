import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { LogoSvg } from '../components/LogoSvg';

const StyledBody = styled.body`
    background: linear-gradient(to right, #5ab3fc, white);
    height: 793px;
  `;

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
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
    <div className="login-body">
      <div className='container'>
        <div className="row pt-5">
          <div className="col-lg-6 d-none d-lg-block login-image">
          </div>

          <div className="col-12 col-lg-6 bg-white">

            <form className="form-container needs-validation p-4" noValidate onSubmit={handleLogin}>

              <div className="text-end">
                <LogoSvg width={'100px'} height={'100px'} />
              </div>
              <h1 className="mb-5 pt-4 text-center fs-3 fw-bold">Bienvenido</h1>

              <div className="form-group mb-4 position-relative">
                <label htmlFor="exampleFormControlInput1" className="form-label">Nombre de usuario</label>
                <input type="text" className="form-control" id="exampleFormControlInput1"
                  value={username} onChange={(e) => setUsername(e.target.value)}
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

              <p>¿No tienes cuenta? <Link to='/register'>Registrate</Link></p>
              <p><a href="">Recuperar password</a></p>

              <div className="form-action">
                <button className="btn btn-primary w-100 mb-3" type="submit">Iniciar Sesión</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

