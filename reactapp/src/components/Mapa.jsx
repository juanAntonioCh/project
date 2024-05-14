import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import { VehicleList } from './VehicleList';
import '../styles/Vehicles.css'
import Pagination from 'react-bootstrap/Pagination';
import Slider from '@mui/material/Slider';
import { getAllVehicles } from '../api/vehicle.api';
import { AuthContext } from '../context/AuthContext';
import { VehiclesContext } from '../context/VehiclesContext';

const VehiculosPorPagina = 6;

export const Mapa = ({ rentDuration, address }) => {
    const [paginaActual, setPaginaActual] = useState(1);

    const { vehiculosFiltrados, vehiculosVisibles, setVehiculosVisibles, calcularPrecioAlquiler, priceRange, maxPrice, minPrice, handleChanges, setMap, defaultCenter } = useContext(VehiclesContext)

    // Función para calcular el índice del primer vehículo en la página actual
    const indiceInicial = (paginaActual - 1) * VehiculosPorPagina;

    // Función para manejar el cambio de página
    const handlePageChange = (pageNumber) => {
        setPaginaActual(pageNumber);
    };

    const mapStyles = {
        height: "600px",
        width: "100%",
        borderRadius: '20px',
    };

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

    // Cálculo del número total de páginas
    const totalPaginas = Math.ceil(vehiculosVisibles.length / VehiculosPorPagina);

    // Función para obtener los vehículos para la página actual
    const obtenerVehiculosPorPagina = () => {
        return vehiculosVisibles.slice(indiceInicial, indiceInicial + VehiculosPorPagina);
    };

    useEffect(() => {
        const filtrarVehiculos = () => {
            const vehiculosFilter = vehiculosFiltrados.filter(vehi => {
                const precioAlquiler = calcularPrecioAlquiler(vehi.precio_por_hora, rentDuration);
                return precioAlquiler >= priceRange[0] && precioAlquiler <= priceRange[1];
            });
            setVehiculosVisibles(vehiculosFilter);
        };
    
        filtrarVehiculos();
        //console.log(priceRange)
    }, [priceRange, rentDuration]);

    useEffect(() => {
        console.log(vehiculosVisibles)
        console.log(vehiculosFiltrados)
    }, [vehiculosVisibles])

    return (
        <div className="container-fluid mt-4">
            <div className="row">

                {vehiculosVisibles.length == 0 ? (
                    <>
                        <Slider value={priceRange} onChange={handleChanges} valueLabelDisplay="auto" min={minPrice} max={maxPrice} style={{ width: '400px', marginLeft: '30px' }} />
                        <h2>No hay vehículos disponibles en esta zona</h2>
                    </>
                ) : (
                    <>
                        <Slider value={priceRange} onChange={handleChanges} valueLabelDisplay="auto" min={minPrice} max={maxPrice} style={{ width: '400px', marginLeft: '30px' }} />
                        <hr />
                        <div className='col-md-6'>
                            <p>Resultados de: <strong>{address}</strong>: {vehiculosVisibles.length} vehículos encontrados</p>
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

