import React, { useEffect } from 'react'
import { useContext, useState } from "react"
import '../styles/Home.css'
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'
import { LogoSvg } from '../components/LogoSvg'
import { BuscadorVehiculos } from '../components/BuscadorVehiculos'
import { api } from '../api/vehicle.api';

export const Home = () => {
  const { isAuthenticated, logout, user, logoutMessage, setLogoutMessage } = useContext(AuthContext);
  const location = useLocation()
  const [notificaciones, setNotificaciones] = useState([]);
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('');

  const message = location.state && location.state.successMessage

  const handleCloseAlert = () => {
    setError(null);
    setLogoutMessage(null)
    setNotificaciones([])
  };

  useEffect(() => {
    let timeout;
    if (error || logoutMessage || successMessage) {
      timeout = setTimeout(() => {
        setError(null);
        setLogoutMessage(null)
        setSuccessMessage(null)
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [error, logoutMessage, successMessage]);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Token ${token}`
      };

      const actualizarAlquileres = async () => {
        try {
          const response = await api.get('/api/actualizar-alquileres/', {
            headers: {
              'Content-Type': 'application/json',
              //'Authorization': `Token ${token}`,
            },
          });
          //console.log('ALquileres actualizados con éxito ', response)
        } catch (error) {
          console.error('Error al actualizar los alquileres:', error);
        }
      }

      const fetchNotificaciones = async () => {
        try {
          const response = await api.get('/api/notificaciones/', { headers });
          //console.log('Las notificaciones son: ', response.data);
          setNotificaciones(response.data);
        } catch (error) {
          console.error('Error al obtener las notificaciones ', error);
        }
      };

      actualizarAlquileres();
      fetchNotificaciones();
    }
  }, [user])

  const marcarLeido = async (id) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Token ${token}`
    };
    try {
      const response = await api.patch(`/api/notificaciones/marcar-leido/${id}/`, {}, { headers });
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.filter(notification => notification.id !== id)
      );
      
      //console.log('Se ha marcado como leido: ', response.data);

    } catch (error) {
      console.error('Error al marcar leidas las notificaciones ', error);
    }
  };

  useEffect(() => {
    //localStorage.removeItem('coordenadas')
    //localStorage.removeItem('startDate')
    //localStorage.removeItem('endDate')
    setSuccessMessage(message)
  }, [])

  return (
    <div className="home-container">

      <div className="notification-container">
        {notificaciones.length > 0 &&
          notificaciones.map((notification) => (
            <div
              key={notification.id}
              className={`alert ${notification.leido ? 'alert-secondary' : 'alert-info'
                } alert-dismissible fade show notification`}
              role="alert"
            >
              <strong>{notification.mensaje}</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => marcarLeido(notification.id)}
                aria-label="Close"
              ></button>
            </div>
          ))}
      </div>
      {error && (
        <div className="alert-container text-center">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{error}</strong>
            <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="alert-container d-flex justify-content-end pt-4">
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>{successMessage}</strong>
          </div>
        </div>
      )}
      {logoutMessage && (
        <div className="alert-container text-center">
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>{logoutMessage}</strong>
            <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
          </div>
        </div>
      )}
      <div className="home-logo">
        <LogoSvg width={'270px'} height={'270px'} />
      </div>
      <h2 className="home-logo mb-4">Tu coche cuando y donde lo necesites</h2>
      <div className="container">
        <BuscadorVehiculos setError={setError} />
      </div>
    </div>
  )

}
