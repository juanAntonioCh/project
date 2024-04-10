import React, { useState } from 'react'
import { useEffect } from 'react'
import '../styles/Vehicles.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getAllVehicles } from '../api/vehicle.api'
import { Mapa } from './Mapa';

export const VehicleList = () => {
    const [vehiculos, setVehiculos] = useState([])

    useEffect(() => {
        async function loadVehicles() {
            const res = await getAllVehicles()
            console.log(res.data)
            setVehiculos(res.data)
        }
        loadVehicles()
    }, [])

    return (
        <div className="container mt-5">
            <div className="row">
                {vehiculos.map((vehi) => (
                    <div key={vehi.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div id={`carousel${vehi.id}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {vehi.imagenes.map((imagen, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img src={imagen.imagen} className="d-block w-100 card-img-top" alt={`Imagen ${index + 1} de ${vehi.marca_details.nombre} ${vehi.modelo_details.nombre}`} />
                                        </div>
                                    ))}
                                </div>
                                {vehi.imagenes.length > 1 && (
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${vehi.id}`} data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel${vehi.id}`} data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{vehi.marca_details.nombre} {vehi.modelo_details.nombre} ({vehi.año})</h5>
                                <a href="#" className="btn btn-primary">Ver más</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Mapa vehiculos={vehiculos}/>
        </div>
        
    )
    
}
