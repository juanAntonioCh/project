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
                        <div className="card">
                            <div id={`carousel${vehi.id}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">

                                    {vehi.imagenes.length > 0 ? (
                                        vehi.imagenes.map((imagen, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                <img src={imagen.imagen} className="d-block w-100 card-img-top" alt={`Imagen ${index + 1} de ${vehi.marca_details.nombre} ${vehi.modelo_details.nombre}`} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="carousel-item active">
                                            <img src="https://gomore.imgix.net/images/default_car_picture.png?ixlib=rails-2.1.2&amp;w=560&amp;h=373" className="d-block w-100 card-img-top img-responsive w-100% h-auto br2" alt="Imagen por defecto" loading="lazy"></img>
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
                                <Link to={`/edit-vehicle/${vehi.id}`} className="btn btn-primary">Editar</Link>
                                <a href="#" className="btn btn-danger m-2">Eliminar</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>

    )

}
