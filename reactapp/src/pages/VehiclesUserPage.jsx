import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getUserVehicles } from '../api/vehicle.api';
import { VehiclesUser } from '../components/VehiclesUser';

export const VehiclesUserPage = () => {
    const { id } = useParams();
    const [vehis, setVehis] = useState([])

    useEffect(() => {
        const getVehicles = async () => {
            try {
                const response = await getUserVehicles(id);
                console.log(response.data)
                setVehis(response.data)

            } catch (error) {
                console.log('Error al obtener los vehiculos del usuario ', error)
            }
        }
        getVehicles()
    }, [])

    return (
        <>
            <h1>Mis vehiculos {id}</h1>

            <VehiclesUser vehiculos={vehis} />

        </>
    )
}
