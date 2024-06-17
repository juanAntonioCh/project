import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, LoadScriptNext, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import { VehicleList } from './VehicleList';
import '../styles/Vehicles.css'
import Pagination from 'react-bootstrap/Pagination';
import Slider from '@mui/material/Slider';
import { getAllVehicles } from '../api/vehicle.api';
import { AuthContext } from '../context/AuthContext';
import { VehiclesContext } from '../context/VehiclesContext';
import { Filtros } from './Filtros';

const VehiculosPorPagina = 6;

export const Mapa = ({ rentDuration, address }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const { user } = useContext(AuthContext);
    const [vehiculos, setVehiculos] = useState([])
    const [map, setMap] = useState(null);
    const [maxPrice, setMaxPrice] = useState(100);
    const [minPrice, setMinPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 90]);
    const [activeMarker, setActiveMarker] = useState(null);
    const { calcularPrecioAlquiler } = useContext(VehiclesContext);
    const { vehiculosFiltrados, setVehiculosFiltrados, vehiculosIniciales, setVehiculosIniciales } = useContext(VehiclesContext)

    useEffect(() => {
        async function loadVehicles() {
            const res = await getAllVehicles()
            //console.log(res.data)
            setVehiculos(res.data)
        }
        loadVehicles()
    }, [])

    const coordenadas = JSON.parse(localStorage.getItem('coordenadas'))
    //console.log('Estas son las coordenandas: ', coordenadas)

    const defaultCenter = {
        lat: coordenadas.lat, lng: coordenadas.lng
    }

    const handleMarkerClick = (vehiculo) => {
        setActiveMarker(vehiculo);
    };

    const handleCloseClick = () => {
        setActiveMarker(null);
    };

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
            return distancia <= radioVisible && vehiculo.propietario != user.id && vehiculo.disponible;
        })
    }

    // useEffect(() => {
    //     console.log(vehiculosFiltrados)
    // }, [vehiculosFiltrados])

    useEffect(() => {
        const vehiculosVisibles = filtrarVehiculosVisibles();
        setVehiculosFiltrados(vehiculosVisibles);
        setVehiculosIniciales(vehiculosVisibles)
    }, [map, vehiculos]);

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
    const totalPaginas = Math.ceil(vehiculosFiltrados.length / VehiculosPorPagina);

    // Función para obtener los vehículos para la página actual
    const obtenerVehiculosPorPagina = () => {
        return vehiculosFiltrados.slice(indiceInicial, indiceInicial + VehiculosPorPagina);
    };

    useEffect(() => {
        const filtroPrecio = () => {
            const vehiculosFiltradosPrecio = filtrarVehiculosVisibles().filter(vehi => {
                const precioAlquiler = calcularPrecioAlquiler(vehi.precio_por_hora, rentDuration);
                return precioAlquiler >= priceRange[0] && precioAlquiler <= priceRange[1];
            });
            setVehiculosFiltrados(vehiculosFiltradosPrecio);
        };

        filtroPrecio();
    }, [priceRange]);

    //console.log(obtenerVehiculosPorPagina())
    //console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

    function handleChanges(e, newValue) {
        //console.log(newValue)
        setPriceRange(newValue);
    }

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <Filtros priceRange={priceRange} handleChanges={handleChanges} minPrice={minPrice} maxPrice={maxPrice} />
                <hr />

                {vehiculosIniciales.length === 0 ? (
                    <div className='col-md-6 d-flex flex-column align-items-center'>
                        <img src="https://getaround.com/packs/images/illustrations/light/character_in_jeep-663819942a9c81f9b29cb10c4471fb0a.svg"
                            alt="" style={{ width: '400px', height: '400px' }} />
                        <h4 className='mt-4'>Oops! No hay vehículos disponibles en esta zona</h4>
                    </div>
                ) : vehiculosFiltrados.length === 0 ? (
                    <div className='col-md-6 d-flex flex-column align-items-center'>
                        <img src="https://getaround.com/packs/images/illustrations/light/character_in_jeep-663819942a9c81f9b29cb10c4471fb0a.svg"
                            alt="" style={{ width: '400px', height: '400px' }} />
                        <h4 className='mt-4'>Oops! No hay resultados para estos filtros</h4>
                    </div>
                ) : (
                    <div className='col-md-6'>
                        <p>Resultados de <strong>{address}</strong>: {vehiculosFiltrados.length} vehículos encontrados</p>
                        <VehicleList vehiculosPagina={obtenerVehiculosPorPagina()} vehiculos={vehiculosFiltrados} setMaxPrice={setMaxPrice} setMinPrice={setMinPrice}
                            setPriceRange={setPriceRange} rentDuration={rentDuration} />
                    </div>
                )}

                <div className='col-md-6'>
                    {/* {!vehiculosIniciales.length === 0 ? (
                        <MapComponent vehiculos={obtenerVehiculosPorPagina()} />
                    ) : <p>Cargando</p>
                    } */}
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={11.5}
                        center={defaultCenter}
                        onLoad={handleLoad}
                    >
                        {
                            obtenerVehiculosPorPagina().map(vehiculo => (

                                <Marker key={vehiculo.id}
                                    icon={iconMarker}
                                    position={{
                                        lat: vehiculo.latitud,
                                        lng: vehiculo.longitud
                                    }}
                                    onClick={() => handleMarkerClick(vehiculo)}
                                />
                            ))
                        }
                        {activeMarker && (
                            <InfoWindow
                                position={{
                                    lat: activeMarker.latitud,
                                    lng: activeMarker.longitud
                                }}
                                onCloseClick={handleCloseClick}
                            >
                                <div>
                                    <h5>{activeMarker.marca_details.nombre} {activeMarker.modelo_details.nombre}</h5>
                                    {activeMarker.imagenes.length > 0 ? (
                                        <img src={activeMarker.imagenes[0].imagen} alt={`Imagen de ${activeMarker.marca_details.nombre} ${activeMarker.modelo_details.nombre}`} />
                                    ) : (
                                        <img src='https://gomore.imgix.net/images/default_car_picture.png?ixlib=rails-2.1.2&amp;w=560&amp;h=373' alt="Imagen por defecto" width={230} height={170}></img>
                                    )}
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>

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

