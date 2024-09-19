import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../styles/Login.css'
import { AuthContext } from '../context/AuthContext';
import { LogoSvg } from '../components/LogoSvg';
import { api } from '../api/vehicle.api';
import LoadingIndicator from '../components/LoadingIndicator';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setError(null);
  };

  const passwordVisibility = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    // Obtener todos los formularios para aplicarle las clases de Bootstrap
    const forms = document.querySelectorAll('.needs-validation');
    //console.log('los formus son: ', forms);

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

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 6000);
    }
    return () => clearTimeout(timeout);
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //intentamos loguear al usuario mediante el username y la contraseña
      const response = await api.post('/auth/login/', { username, password });

      try {
        //verificamos si el usuario ha verificado su cuenta mediante el enlace enviado a su correo
        const verify_user = await api.get(`/api/verify/login/${username}/`)
        console.log(verify_user)

        //si se ha logueado correctamente y su cuenta esta verificada, puede acceder a la aplicación
        localStorage.setItem('token', response.data.key); // Guardar el token
        login()
        //console.log('Inicio de sesión exitoso');
        navigate('/', { replace: true });

      } catch (error) {
        console.log(error.response.data.error)
        setError(error.response.data.error)

      }


    } catch (error) {
      console.log('Error en el inicio de sesión', error.response.data)
      setError('Nombre de usuario o contraseña incorrectos')

    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="login-body">
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
          <div className="col-lg-6 d-none d-lg-block login-image">
          </div>

          <div className="col-12 col-lg-6 bg-white">

            <form className="form-container needs-validation p-4" noValidate onSubmit={handleLogin}>

              <div className="text-end">
                <LogoSvg width={'100px'} height={'100px'} />
              </div>
              <h1 className="mb-5 pt-3 text-center fs-3 fw-bold">Bienvenido</h1>

              <div className="form-group mb-4 position-relative">
                <label htmlFor="exampleFormControlInput1" className="form-label">Nombre de usuario</label>
                <input type="text" className="form-control" id="exampleFormControlInput1"
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

              <div className="form-group mb-4 position-relative">
                <label htmlFor="inputPassword5" className="form-label">Contraseña</label>
                <input type={showPassword ? 'text' : 'password'} id="inputPassword5" className="form-control" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                  // title="La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra y un número"
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

                <span
                  className="position-absolute end-0 top-50 me-3"
                  onClick={passwordVisibility}
                  style={{ cursor: "pointer", transform: 'translateY(10%)' }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              {loading && (
                <div className="d-flex justify-content-center mb-3">
                  <LoadingIndicator />
                </div>
              )}

              <div className="form-action">
                <button className="btn btn-primary w-100 mb-3" type="submit">Iniciar Sesión</button>
              </div>

              <p className='mt-3'>¿No tienes cuenta? <Link to='/register'>Regístrate</Link></p>
              <p>¿Has olvidado tu contraseña? <Link to='/password/reset'>Recuperar contraseña</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

