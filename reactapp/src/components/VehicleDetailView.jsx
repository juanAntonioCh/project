import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AlquilerCard } from './AlquilerCard';

export const VehicleDetailView = () => {
    const { id } = useParams();
    const [map, setMap] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coords, setCoords] = useState({ lat: '', lng: '' })

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8000/api/vehicles/${id}`);
                setVehicle(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching vehicle", error);
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);


    const mapStyles = {
        height: "100%",
        width: "100%",
        borderRadius: '20px',
    };

    const handleLoad = (map) => {
        setMap(map);
    }

    const iconMarker = {
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.8,
        strokeWeight: 0.5,
        rotation: 0,
        scale: 1.8,
        anchor: new google.maps.Point(0, 20),
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!vehicle) {
        return <div>No se ha encontrado el vehículo</div>;
    }

    return (
        <div className="container mt-4">
            <div className='row vehicle-detail-card'>
                <div id={`carouselVehicleImages`} className="carousel slide col-6" data-bs-ride="carousel">
                    
                    <div className="carousel-inner">
                        {vehicle.imagenes.length > 0 ? (
                            vehicle.imagenes.map((imagen, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''} vehicle-detail-carousel-item`}>
                                    <img src={imagen.imagen} className="d-block w-100" alt={`Imagen de ${vehicle.marca_details.nombre} ${vehicle.modelo_details.nombre}`} />
                                </div>
                            ))
                        ) : (
                            <div className="carousel-item active">
                                <img src="https://gomore.imgix.net/images/default_car_picture.png?ixlib=rails-2.1.2&amp;w=560&amp;h=373" className="img-responsive w-100% h-auto br2" alt="Imagen por defecto" loading="lazy"></img>
                            </div>
                        )}
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

                <div className='col-6 card'>
                    <div className='card-body'>

                        <p className="card-text">{vehicle.precio_por_hora} $</p>
                        <p className="card-text">Por hora</p>
                    </div>


                </div>

            </div>
            {/* <h1>{vehicle.marca_details.nombre} {vehicle.modelo_details.nombre} ({vehicle.año})</h1> */}

            <div className="card mt-3 mb-5">
                <div className="row card-body  mt-3 mb-5">
                    <div className='col-6'>
                        <p className="card-text"><strong>Propietario: </strong> {vehicle.propietario_details.username}</p>
                        <p className="card-text"><strong>Matrícula:</strong> {vehicle.matricula}</p>
                        <p className="card-text"><strong>Color:</strong> {vehicle.color}</p>
                        <p className="card-text"><strong>Kilometraje:</strong> {vehicle.kilometraje} km</p>
                        <p className="card-text"><strong>Autonomía:</strong> {vehicle.autonomia} km</p>
                        <p className="card-text"><strong>Consumo:</strong> {vehicle.consumo} 
                        {vehicle.tipo_combustible === 'electrico' ? <i> kWh/100 km</i> : <i> l/100 km</i>}
                        </p>
                        <p className="card-text"><strong>Combustible:</strong> {vehicle.tipo_combustible}</p>
                        <p className="card-text"><strong>Cambio:</strong> {vehicle.tipo_cambio}</p>
                        <p className="card-text"><strong>Carrocería:</strong> {vehicle.tipo_carroceria}</p>
                        <p className="card-text"><strong>Número de plazas:</strong> {vehicle.numero_plazas}</p>
                        <p className="card-text"><strong>Precio por Hora:</strong> {vehicle.precio_por_hora}</p>
                    </div>

                    <div className='col-6'>
                        <LoadScriptNext
                            googleMapsApiKey='AIzaSyC_G0xCXyALB3IgkE5D4RpWWAxRIg9xCuQ'>
                            <GoogleMap
                                mapContainerStyle={mapStyles}
                                zoom={15}
                                center={{ lat: vehicle.latitud, lng: vehicle.longitud }}
                                onLoad={handleLoad}
                            >

                                <Marker key={vehicle.id}
                                    icon={iconMarker}
                                    position={{
                                        lat: vehicle.latitud,
                                        lng: vehicle.longitud
                                    }}
                                />

                            </GoogleMap>
                        </LoadScriptNext>
                    </div>

                </div>
                <AlquilerCard />
            </div>
        </div >



    );
}
