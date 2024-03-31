import React from 'react'
import { Link } from 'react-router-dom'
import { Register } from './Register'

export const Home = () => {
  return (
    <>
        <h1>ConectaCar</h1>
        <Link to='/register'>Registrate aquí</Link>
        <br />
        <Link to='/login'>Iniciar sesión</Link>
    </>
    
  )
}
