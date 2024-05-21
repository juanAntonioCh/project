import React, { useEffect } from 'react'
import { useContext, useState } from "react"
import '../styles/Home.css'
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'
import { LogoSvg } from '../components/LogoSvg'
import { BuscadorVehiculos } from '../components/BuscadorVehiculos'

export const Home = () => {
  const { isAuthenticated, logout, user, logoutMessage, setLogoutMessage } = useContext(AuthContext);
  const [error, setError] = useState('');

  console.log('MENSAJE DE LOGOUT: ', logoutMessage)


  useEffect(() => {
    console.log(error)
  }, [error])

  const handleCloseAlert = () => {
    setError(null);
  };

  useEffect(() => {
    let timeout;
    if (error || logoutMessage) {
      timeout = setTimeout(() => {
        setError(null);
        setLogoutMessage(null)
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [error, logoutMessage]);

  console.log(isAuthenticated)
  console.log(user)

  useEffect(() => {
    localStorage.removeItem('coordenadas')
  }, [])

  return (
    <div className="home-container">
      {error && (
        <div className="alert-container text-center">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{error}</strong>
            <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
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
        <LogoSvg width={'260px'} height={'260px'} />
      </div>
      <h2 className="home-logo">¿Dónde necesitas tu coche?</h2>
      <div className="home-buscador-ubis-container">
        <BuscadorVehiculos setError={setError} />
      </div>
    </div>
  )

}
