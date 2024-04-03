import React from 'react'
import { Link } from 'react-router-dom'
import { Register } from './Register'
import { BuscadorUbis } from '../components/BuscadorUbi'

export const Home = () => {
  return (
    <>
        <h1>ConectaCar</h1>
        <BuscadorUbis/>
        <hr />
        <Link to='/register'>Registrate aquí</Link>
        <br />
        <Link to='/login'>Iniciar sesión</Link>
    </>
    
  )
}
