import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navbar } from './Navbar';
import { VehiclesContext } from '../context/VehiclesContext';
import { UseBuscador } from '../hooks/UseBuscador';

export const VehicleList = ({ vehiculosPagina, vehiculos, rentDuration , setMaxPrice, setMinPrice, setPriceRange}) => {
    const { calcularPrecioAlquiler } = useContext(VehiclesContext);
    const { fromatStartDate, formatEndDate } = useContext(VehiclesContext)
    //console.log(fromatStartDate)
    //console.log(formatEndDate)

    //Ajustar los rangos de Precios en el filtro
    useEffect(() => {
        const preciosPorHora = vehiculos.map(vehi => calcularPrecioAlquiler(vehi.precio_por_hora, rentDuration));
        const preciosNumericos = preciosPorHora.filter(precio => !isNaN(precio));
        const maxPrecio = Math.max(...preciosNumericos);
        const minPrecio = Math.min(...preciosNumericos);
        setMaxPrice(maxPrecio);
        setMinPrice(minPrecio)
        setPriceRange([minPrecio, maxPrecio])
        //console.log(maxPrecio);
    }, [])
    //}, [vehiculos])

    return (
        <div className='row'>

            {vehiculosPagina.map((vehi) => (
                <div key={vehi.id} className="col-6 col-sm-4 col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 vehicle-list-card">
                        <div id={`carousel${vehi.id}`} className="carousel slide">
                            <div className="carousel-inner">

                                {vehi.imagenes.length > 0 ? (
                                    vehi.imagenes.map((imagen, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''} vehicle-list-carousel-item`}>
                                            <img src={imagen.imagen} className="d-block w-100 card-img-top" alt={`Imagen ${index + 1} de ${vehi.marca_details.nombre} ${vehi.modelo_details.nombre}`} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="carousel-item active vehicle-list-carousel-item">
                                        <img src='https://gomore.imgix.net/images/default_car_picture.png?ixlib=rails-2.1.2&amp;w=560&amp;h=373' className="d-block w-100 card-img-top img-responsive h-auto br2" alt="Imagen por defecto" loading="lazy"></img>
                                    </div>
                                )}
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
                            <h5 className="card-title">{vehi.marca_details.nombre} {vehi.modelo_details.nombre}</h5>
                            <p><strong>{calcularPrecioAlquiler(vehi.precio_por_hora, rentDuration)} €</strong> por {rentDuration.hours} h/ {rentDuration.minutes} mins</p>
                            {/* <p>{vehi.tipo_combustible}</p>
                            <p>{vehi.numero_plazas}</p>
                            <p>{vehi.tipo_carroceria}</p>
                            <p>{vehi.tipo_cambio}</p> */}
                            <Link to={`/vehicle/${vehi.id}`} target='_blank' className="btn fw-bold vehicle-list-ver-mas">Ver más</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

}
