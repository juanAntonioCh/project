import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import { VehicleList } from './VehicleList';
import '../styles/Vehicles.css'
import Pagination from 'react-bootstrap/Pagination';
import { getAllVehicles } from '../api/vehicle.api';
import { AuthContext } from '../context/AuthContext';

const VehiculosPorPagina = 6;

export const Mapa = ({ rentDuration, address }) => {
    const [map, setMap] = useState(null);
    const [vehiculos, setVehiculos] = useState([])
    const { user } = useContext(AuthContext);
    const [paginaActual, setPaginaActual] = useState(1);

    // Función para calcular el índice del primer vehículo en la página actual
    const indiceInicial = (paginaActual - 1) * VehiculosPorPagina;

    // Función para manejar el cambio de página
    const handlePageChange = (pageNumber) => {
        setPaginaActual(pageNumber);
    };

    useEffect(() => {
        async function loadVehicles() {
            const res = await getAllVehicles()
            console.log(res.data)
            setVehiculos(res.data)
        }
        loadVehicles()
    }, [])

    useEffect(() => {
        console.log(vehiculos)
        //console.log('UUUUUUUSERRRR: ', user)
    }, [vehiculos])

    const coordenadas = JSON.parse(localStorage.getItem('coordenadas'))
    console.log('Estas son las coordenandas: ', coordenadas)

    const mapStyles = {
        height: "600px",
        width: "100%",
        borderRadius: '20px',
    };

    const defaultCenter = {
        lat: coordenadas.lat, lng: coordenadas.lng
        //lat: 43.3623436, lng: -8.4115401
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

    const handleLoad = (map) => {
        setMap(map);
    }

    const calcularRadio = (zoom) => {
        const radioBase = 0.013;
        return radioBase * Math.pow(2, (21 - zoom));
    }

    function distanciaEntreDosPuntos(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en kilómetros
        const rad = Math.PI / 180;
        const deltaLat = (lat2 - lat1) * rad;
        const deltaLng = (lng2 - lng1) * rad;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en kilómetros
    }

    //Funcion para mostrar tan solo los vehiculos que se encuentren en la ubicación seleccionada, no pertenezcan al 
    //usuario que tiene la sesión activa y estén disponibles, es decir, no los haya alquilado nadie
    const filtrarVehiculosVisibles = () => {
        if (!map) return [];

        const zoom = map.getZoom();
        //const center = map.getCenter();
        const radioVisible = calcularRadio(zoom);

        return vehiculos.filter(vehiculo => {
            const distancia = distanciaEntreDosPuntos(defaultCenter.lat, defaultCenter.lng, vehiculo.latitud, vehiculo.longitud);
            return distancia <= radioVisible && vehiculo.propietario != user && vehiculo.disponible;
        })
    }

    // Cálculo del número total de páginas
    const totalPaginas = Math.ceil(filtrarVehiculosVisibles().length / VehiculosPorPagina);

    // Función para obtener los vehículos para la página actual
    const obtenerVehiculosPorPagina = () => {
        return filtrarVehiculosVisibles().slice(indiceInicial, indiceInicial + VehiculosPorPagina);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="row">

                {filtrarVehiculosVisibles().length == 0 ? (
                    <h2>No hay vehículos disponibles en esta zona</h2>
                ) : (
                    <>
                        <p>Resultados de: <strong>{address}</strong></p>
                        <p>{filtrarVehiculosVisibles().length} vehículos encontrados</p>
                        <div className='col-md-6'>
                            <VehicleList vehiculos={obtenerVehiculosPorPagina()} rentDuration={rentDuration} />
                        </div>
                    </>
                )}

                <div className='col-md-6'>
                    <LoadScriptNext
                        googleMapsApiKey='AIzaSyC_G0xCXyALB3IgkE5D4RpWWAxRIg9xCuQ'>
                        <GoogleMap
                            mapContainerStyle={mapStyles}
                            zoom={11.5}
                            center={defaultCenter}
                            onLoad={handleLoad}
                        >
                            {
                                obtenerVehiculosPorPagina().map(vehiculo => {
                                    return (
                                        <Marker key={vehiculo.id}
                                            icon={iconMarker}
                                            position={{
                                                lat: vehiculo.latitud,
                                                lng: vehiculo.longitud
                                            }}
                                        />
                                    )
                                })
                            }
                        </GoogleMap>
                    </LoadScriptNext>

                    <div className='mt-4'>
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => handlePageChange(paginaActual - 1)}
                                disabled={paginaActual === 1}
                            />
                            {[...Array(totalPaginas)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === paginaActual}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => handlePageChange(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas}
                            />
                        </Pagination>

                    </div>

                </div>
            </div>

        </div>

    )
}

