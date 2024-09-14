// EmailVerification.js
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import { api } from '../api/vehicle.api';

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true)
  const token = searchParams.get('token');
  console.log(token)

  useEffect(() => {
    if (token) {
      // Llamar a la API para verificar el token
      verifyEmailToken(token);
    }
  }, [token]);

  const verifyEmailToken = async (token) => {
    try {
      const response = await api.get(`/api/verify/?token=${token}`);
      //console.log(response)

      if (response.status=200) {
        // Manejar verificación exitosa
        //alert('Tu correo ha sido verificado con éxito.');
        setLoading(false)

      } else {
        // Manejar error de verificación
        alert('El token de verificación no es válido o ha expirado.');
      }
    } catch (error) {
      console.error('Error durante la verificación del token:', error);
      alert('Hubo un problema al verificar tu correo.');
    }
  };

  return (
    <div className='login-body pt-5'>
      <div className='container w-50'>
        <div className='row bg-white p-4 rounded shadow'>

          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center">
                <p>Estamos verificando tu correo, por favor espera...</p>
                <LoadingIndicator />
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center">
                <h2>¡Correo verificado con éxito!</h2>
                <p>Ya puedes iniciar sesión con tu nueva cuenta.</p>
                <Link to='/login'>Iniciar sesión</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
