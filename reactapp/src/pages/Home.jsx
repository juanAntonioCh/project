import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { BuscadorUbis } from '../components/BuscadorUbi'
import { AuthContext } from '../context/AuthContext'
import { LogoSvg } from '../components/LogoSvg'

export const Home = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  console.log(isAuthenticated)

  //localStorage.removeItem('coordenadas')

  return (
    <div className="home-container">
      {!isAuthenticated ? (
        <div className="auth-links">
          <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="#007bff" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>
          <Link to="/register" className="auth-link">Regístrate aquí</Link>
          <Link to="/login" className="auth-link">Iniciar sesión</Link>
        </div>
      ) : (
        <div className="auth-links">
          <button onClick={logout} className="logout-button">Cerrar sesión</button>
        </div>
      )}
      
      <div className="logo">
        <LogoSvg/>
      </div>
      <h2 className="logo">¿Dónde necesitas tu coche?</h2>
      <div className="buscador-ubis-container">
        <BuscadorUbis />
      </div>
      <hr />
      <div className="rent">
        <Link to="/rent-car" className="rent-link">Alquila tu coche</Link>
      </div>
    </div>
  )

}
