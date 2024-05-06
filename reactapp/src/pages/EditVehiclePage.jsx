import React from 'react'
import { useParams } from 'react-router-dom'

export const EditVehiclePage = () => {
  const { id } = useParams();

  return (
    <>
      <h1>Editar {id}</h1>
    </>
  )
}
