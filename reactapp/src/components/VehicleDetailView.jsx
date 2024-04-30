import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export const VehicleDetailView = () => {
    const { id } = useParams();
    console.log(id)
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8000/api/vehicles/${id}`);
                setVehicle(data);
                setLoading(false);
                console.log(vehicle)
            } catch (error) {
                console.error("Error fetching vehicle", error);
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!vehicle) {
        return <div>No vehicle found</div>;
    }

    return (
        <div className="container mt-4">
            <h1>{vehicle.marca_details.nombre} {vehicle.modelo_details.nombre} ({vehicle.año})</h1>
            <div id={`carouselVehicleImages`} className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {vehicle.imagenes.map((imagen, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <img src={imagen.imagen} className="d-block w-100" alt={`Imagen de ${vehicle.marca_details.nombre} ${vehicle.modelo_details.nombre}`} />
                        </div>
                    ))}
                </div>
                {vehicle.imagenes.length > 1 && (
                    <>
                        <button className="carousel-control-prev" type="button" data-bs-target={`#carouselVehicleImages`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#carouselVehicleImages`} data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </>
                )}
            </div>
            <div className="card mt-3">
                <div className="card-body">
                    <p className="card-text"><strong>Propietario: </strong> {vehicle.propietario_details.username}</p>
                    <p className="card-text"><strong>Matrícula:</strong> {vehicle.matricula}</p>
                    <p className="card-text"><strong>Color:</strong> {vehicle.color}</p>
                    <p className="card-text"><strong>Kilometraje:</strong> {vehicle.kilometraje}</p>
                    <p className="card-text"><strong>Consumo:</strong> {vehicle.consumo}</p>
                    <p className="card-text"><strong>Tipo de Combustible:</strong> {vehicle.tipo_combustible}</p>
                    <p className="card-text"><strong>Precio por Hora:</strong> {vehicle.precio_por_hora}</p>
                </div>
            </div>
        </div>
    );
}
