import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/EditVehiclesStyles.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navbar } from './Navbar';

export const VehiclesUser = ({ vehiculos }) => {
    console.log(vehiculos)
    return (
        <>
            <div className="row bg-white p-4 vehicles-user-row">

                {vehiculos.map((vehi) => (
                    <div key={vehi.id} className="col-md-6 col-lg-3 mb-3">
                        <div className="card vehicle-list-card">
                            <div id={`carousel${vehi.id}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">

                                    {vehi.imagenes.length > 0 ? (
                                        vehi.imagenes.map((imagen, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''} vehicle-list-carousel-item`}>
                                                <img src={imagen.imagen} className="d-block w-100 card-img-top" alt={`Imagen ${index + 1} de ${vehi.marca_details.nombre} ${vehi.modelo_details.nombre}`} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="carousel-item active  vehicle-list-carousel-item">
                                            <img src="https://gomore.imgix.net/images/default_car_picture.png?ixlib=rails-2.1.2&amp;w=560&amp;h=373" className="d-block w-100 card-img-top" alt="Imagen por defecto" loading="lazy"></img>
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
                                <div className='text-center d-flex justify-content-center mt-3'>
                                    <Link to={`/edit-vehicle/${vehi.id}`} className="btn btn-primary vehicles-user-edit">Editar</Link>
                                    <a href="#" className="btn vehicles-user-delete fw-bold">Eliminar</a>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>

    )

}
