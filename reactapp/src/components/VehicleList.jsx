import React from 'react'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navbar } from './Navbar';

export const VehicleList = ({ vehiculos, rentDuration }) => {

    console.log('VEHICLE LIST: ', rentDuration)

    const calcularPrecioAlquiler = (precioPorHora, rentDuration) => {
        const { hours, minutes } = rentDuration;
        const totalMinutes = hours * 60 + minutes;
        const precioTotal = (totalMinutes / 60) * precioPorHora;
        return precioTotal.toFixed(2);
    };

    return (
            <div className='row'>

                {vehiculos.map((vehi) => (
                    <div key={vehi.id} className="col-lg-4 mb-4">
                        <div className="card h-100">
                            <div id={`carousel${vehi.id}`} className="carousel slide">
                                <div className="carousel-inner">

                                    {vehi.imagenes.length > 0 ? (
                                        vehi.imagenes.map((imagen, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                <img src={imagen.imagen} className="d-block w-100 card-img-top" alt={`Imagen ${index + 1} de ${vehi.marca_details.nombre} ${vehi.modelo_details.nombre}`} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="carousel-item active">
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
                                <h5 className="card-title">{vehi.marca_details.nombre} {vehi.modelo_details.nombre} ({vehi.año})</h5>
                                <Link to={`/vehicle/${vehi.id}`} className="btn btn-primary">Ver más</Link>
                                <p>Precio del alquiler: {calcularPrecioAlquiler(vehi.precio_por_hora, rentDuration)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    )

}
