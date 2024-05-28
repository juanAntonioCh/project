import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import '../styles/EditVehiclesStyles.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navbar } from './Navbar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/vehicle.api';

export const VehiclesUser = ({ vehiculos, setVehiculos, setMensaje }) => {
    const [showModal, setShowModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    const handleShowModal = (vehicleId) => {
        setVehicleToDelete(vehicleId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setVehicleToDelete(null);
        setShowModal(false);
    };

    const handleDeleteVehicle = () => {
        try{
            const res = api.delete(`/api/vehicles/${vehicleToDelete}/`)
            setVehiculos(prevVehiculos => prevVehiculos.filter(vehi => vehi.id !== vehicleToDelete));
            setMensaje('Vehículo eliminado con éxito')
        } catch (error){
            console.log('Error al eliminar el vehiculo', error)
        }
        console.log('Eliminando vehículo con ID:', vehicleToDelete);
        handleCloseModal();
    };

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
                                        <div className="carousel-item active vehicle-list-carousel-item">
                                            <img src="https://gomore.imgix.net/images/default_car_picture.png?ixlib=rails-2.1.2&amp;w=560&amp;h=373" className="d-block w-100 card-img-top" alt="Imagen por defecto" loading="lazy" />
                                        </div>
                                    )}
                                </div>
                                {vehi.imagenes.length > 1 && (
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${vehi.id}`} data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true" />
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel${vehi.id}`} data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true" />
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{vehi.marca_details.nombre} {vehi.modelo_details.nombre}</h5>
                                <div className="text-center d-flex justify-content-center mt-3">
                                    <Link to={`/edit-vehicle/${vehi.id}`} className="btn btn-primary vehicles-user-edit">Editar</Link>
                                    <button onClick={() => handleShowModal(vehi.id)} className="btn vehicles-user-delete fw-bold">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmación de Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres eliminar este vehículo?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteVehicle}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

