import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { BuscadorUbis } from '../components/BuscadorUbi'
import { AuthContext } from '../context/AuthContext'

export const Home = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  console.log(isAuthenticated)

  //localStorage.removeItem('coordenadas')

  return (
    <div className="home-container">
      {!isAuthenticated ? (
        <div className="auth-links">
          <Link to="/register" className="auth-link">Regístrate aquí</Link>
          <Link to="/login" className="auth-link">Iniciar sesión</Link>
        </div>
      ) : (
        <div className="auth-links">
          <button onClick={logout} className="logout-button">Cerrar sesión</button>
        </div>
      )}
      <h1 className="home-title">ConectaCar</h1>
      <h2 className="home-title">¿Dónde necesitas tu coche?</h2>
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
