import React, { useState } from 'react'
import { useEffect } from 'react'
import { getAllVehicles } from '../api/vehicle.api'

export const VehicleList = () => {
    const [vehiculos, setVehiculos] = useState([])

    useEffect(() => {
        async function loadVehicles() {
            const res = await getAllVehicles()
            console.log(res.data)
            setVehiculos(res.data)
        }
        loadVehicles()

        console.log('hola')
    }, [])

    return (
        <>
            {vehiculos.map(vehi => (
                <div key={vehi.id}>
                    <h2>{vehi.marca.nombre} {vehi.modelo.nombre}</h2>
                    {vehi.imagenes.map((imagen, index) => (
                        <img key={index} src={imagen.imagen} alt={`Imagen de ${vehi.marca} ${vehi.modelo}`} />
                    ))}
                </div>
            ))}

        </>
    )
}
