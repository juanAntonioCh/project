import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from "react"
import '../styles/Home.css'
import { BuscadorUbis } from '../components/BuscadorUbi'
import { AuthContext } from '../context/AuthContext'
import { LogoSvg } from '../components/LogoSvg'

export const Home = () => {
  const { isAuthenticated, logout, user} = useContext(AuthContext);
  console.log(isAuthenticated)
  console.log(user)

  //localStorage.removeItem('coordenadas')

  return (
    <div className="home-container">
      {!isAuthenticated ? (
        <div className="home-auth-links">
          <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="#007bff" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>
          <Link to="/register" className="home-auth-link">Regístrate aquí</Link>
          <Link to="/login" className="home-auth-link">Iniciar sesión</Link>
        </div>
      ) : (
        <div className="home-auth-links">
          {/* <Link to={`/vehicle/${vehi.id}`} className="btn btn-primary">Mis vehiculos publicados</Link> */}
          <Link to={`/my-vehicles/${user}`}>Mis vehiculos publicados</Link>
          <button onClick={logout} className="home-logout-button">Cerrar sesión</button>
        </div>
      )}
      
      <div className="home-logo">
        <LogoSvg width={'260px'} height={'260px'}/>
      </div>
      <h2 className="home-logo">¿Dónde necesitas tu coche?</h2>
      <div className="home-buscador-ubis-container">
        <BuscadorUbis />
      </div>
      <div className="home-rent">
        <Link to="/rent-car" className="home-rent-link">Alquila tu coche</Link>
      </div>
    </div>
  )

}
