import React, { useEffect } from 'react'
import { useState } from 'react'
import { createVehicle } from '../api/vehicle.api'

export const VehicleForm = () => {
  const [vehiculo, setVehiculo] = useState({
    //owner: null,
    make: '',
    model: '',
    year: 0,
    license_plate: '',
    description: '',
    is_available: false
  })

  const crearVehiculo = (e) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value

    })
  }

  async function enviarVehiculo(e){
    e.preventDefault()
    console.log(vehiculo)
    const res = await createVehicle(vehiculo)
    console.log(res)
  }


  return (
    <>
      <h1>Crear un nuevo vehiculo</h1>
      <form onSubmit={enviarVehiculo}>
        <label htmlFor="">Marca</label>
        <input onChange={crearVehiculo} type="text" name='make' /><br />

        <label htmlFor="">Modelo</label>
        <input onChange={crearVehiculo} type="text" name='model' /><br />

        <label htmlFor="">Año</label>
        <input onChange={crearVehiculo} type="number" name='year' /><br />

        <label htmlFor="">Matricula</label>
        <input onChange={crearVehiculo} type="text" name='license_plate' /><br />

        <label htmlFor="">Descripcion</label>
        <input onChange={crearVehiculo} type="text" name='description' /><br />

        <label htmlFor="">Ubicación</label>
        <input onChange={crearVehiculo} type="text" name='ubicacion' /><br />

        <label htmlFor="">
          Disponible
          <input type="checkbox" name="is_available"/>
        </label><br />

        <input type="submit" value='Enviar'/>

      </form>
    </>
  )
}
