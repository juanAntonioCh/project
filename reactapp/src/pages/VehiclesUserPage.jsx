import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { getUserVehicles } from '../api/vehicle.api';
import { VehiclesUser } from '../components/VehiclesUser';

export const VehiclesUserPage = () => {
    const { id } = useParams();
    const location = useLocation()
    const [successMessage, setSuccessMessage] = useState('')
    const [vehis, setVehis] = useState([])

    const message = location.state && location.state.successMessage
    //console.log(message)

    const handleCloseAlert = () => {
        setSuccessMessage(null);
    };

    useEffect(() => {
        let timeout;
        if (successMessage) {
            timeout = setTimeout(() => {
                setSuccessMessage(null)
            }, 4500);
        }
        return () => clearTimeout(timeout);
    }, [successMessage]);

    useEffect(() => {
        const getVehicles = async () => {
            try {
                const response = await getUserVehicles(id);
                //console.log(response.data)
                setVehis(response.data)

            } catch (error) {
                console.log('Error al obtener los vehiculos del usuario ', error)
            }
        }
        setSuccessMessage(message)
        getVehicles()
    }, [])

    return (
        <div className="login-body">
            {successMessage && (
                <div className="alert-container d-flex justify-content-end">
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>{successMessage}</strong>
                    </div>
                </div>
            )}

            <div className="container pt-4">
                <VehiclesUser vehiculos={vehis} setVehiculos={setVehis} setMensaje={setSuccessMessage}/>
            </div>
        </div>
    )
}
