import React, { useEffect } from 'react'
import { useContext, useState } from "react"
import '../styles/Home.css'
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'
import { LogoSvg } from '../components/LogoSvg'
import { BuscadorVehiculos } from '../components/BuscadorVehiculos'

export const Home = () => {
  const { isAuthenticated, logout, user, logoutMessage, setLogoutMessage } = useContext(AuthContext);
  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('');

  const message = location.state && location.state.successMessage
  console.log(message)
  console.log('MENSAJE DE LOGOUT: ', logoutMessage)

  const handleCloseAlert = () => {
    setError(null);
    setLogoutMessage(null)
  };

  useEffect(() => {
    let timeout;
    if (error || logoutMessage || successMessage) {
      timeout = setTimeout(() => {
        setError(null);
        setLogoutMessage(null)
        setSuccessMessage(null)
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [error, logoutMessage, successMessage]);

  console.log(isAuthenticated)
  console.log(user)

  useEffect(() => {
    localStorage.removeItem('coordenadas')
    localStorage.removeItem('startDate')
    localStorage.removeItem('endDate')
    setSuccessMessage(message)
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
