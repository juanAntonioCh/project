import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { BuscadorUbis } from '../components/BuscadorUbi'
import { AuthContext } from '../context/AuthContext'

export const Home = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  console.log(isAuthenticated)


  return (
    <>
      <h1>ConectaCar</h1>
      <BuscadorUbis />
      <hr />
      {!isAuthenticated ? (
        <>
          <Link to='/register'>Registrate aquí</Link>
          <br />
          <Link to='/login'>Iniciar sesión</Link>
        </>
      ) : (
        <button onClick={logout}>Cerrar sesión</button>
      )}

    </>

  )
}
