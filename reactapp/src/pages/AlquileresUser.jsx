import React, { useEffect, useState } from 'react'
import { api } from '../api/vehicle.api';
import { Link } from 'react-router-dom';

export const AlquileresUser = () => {
    const [reservas, setReservas] = useState([]);
    const [estado, setEstado] = useState('pendiente');

    useEffect(() => {
        const fetchReservas = async () => {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Token ${token}`
            };
            try {
                const response = await api.get(`/api/alquileres/solicitante/?estado=${estado}`, { headers })
                console.log(response)
                setReservas(response.data);
            } catch (error) {
                console.error('Error al obtener las reservas del propietario:', error);
            }
        }
        fetchReservas();
    }, [estado]);

    function formatDate(dateString) {
        const dateParts = dateString.split('T')[0].split('-');
        const timeParts = dateString.split('T')[1].split('.')[0].split(':');

        const day = dateParts[2];
        const month = dateParts[1];
        const year = dateParts[0];

        const hours = timeParts[0];
        const minutes = timeParts[1];

        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    }

    useEffect(() => {
        console.log(reservas)
    }, [reservas])

    return (
        <div className="login-body d-flex justify-content-center">
            <div className="container pt-4 ">
                {reservas.length > 0 ? (
                    <div className="bg-white p-4 buzon-mensajes-row">
                        {reservas.map(reserva => (
                            <div key={reserva.id} className="row my-3">
                                <div className="col-md-3">
                                    <div id={`carousel${reserva.id}`} className="carousel slide">
                                        <div className="carousel-inner">

                                            {reserva.vehiculo_details.imagenes.length > 0 ? (
                                                reserva.vehiculo_details.imagenes.map((imagen, index) => (
                                                    <div key={imagen.id} className={`carousel-item ${index === 0 ? 'active' : ''} vehicle-list-carousel-item`}>
                                                        <img src={imagen.imagen} className="d-block w-100 card-img-top" alt='' />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="carousel-item active vehicle-list-carousel-item">
                                                    <img src='https://gomore.imgix.net/images/default_car_picture.png?ixlib=rails-2.1.2&amp;w=560&amp;h=373' className="" alt="Imagen por defecto" loading="lazy"></img>
                                                </div>
                                            )}
                                        </div>
                                        {reserva.vehiculo_details.imagenes.length > 1 && (
                                            <>
                                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${reserva.id}`} data-bs-slide="prev">
                                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Previous</span>
                                                </button>
                                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel${reserva.id}`} data-bs-slide="next">
                                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Next</span>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </div>
                                <div className="col-md-9">
                                    <div className="card">
                                        <div className="card-body row">
                                            <h5 className="card-title">{reserva.vehiculo_details.marca_details.nombre} {reserva.vehiculo_details.modelo_details.nombre}</h5>
                                            <p className="card-text col-6">
                                                <strong>Propietario:</strong> {reserva.vehiculo_details.propietario_details.username}<br />
                                                <strong>Fecha de inicio:</strong> {formatDate(reserva.fecha_inicio)}<br />
                                                <strong>Fecha de fin:</strong> {formatDate(reserva.fecha_fin)}<br />
                                                <strong>Fecha de la solicitud:</strong> {new Date(reserva.fecha_reserva).toLocaleString()}<br />
                                                <strong>Precio final:</strong> {reserva.precio_total} €<br />
                                            </p>
                                            <div className="col-6 d-flex flex-column justify-content-evenly">
                                                {reserva.estado === 'pendiente' && (
                                                    <h4>En espera de que {reserva.vehiculo_details.propietario_details.username} acepte la reserva ...</h4>
                                                )}
                                                {reserva.estado === 'confirmado' && (
                                                    <h3>ACEPTADO</h3>
                                                )}
                                                {reserva.estado === 'rechazado' && (
                                                    <h4>{reserva.vehiculo_details.propietario_details.username} ha rechazado tu solicitud </h4>
                                                )}
                                                {reserva.estado === 'activo' && (
                                                    <h3>ACTIVO</h3>
                                                )}
                                                {reserva.estado === 'finalizado' && (
                                                    <h3>FINALIZADO</h3>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                ) : (
                    <div className="bg-white p-4 buzon-mensajes-row">
                        <h3 className='text-center'>No tinenes ningún alquiler {estado}</h3>
                        <p className='text-center'>¡Solucionemos eso!</p>
                        <p className='text-center'><Link to='/home'>Busca un vehículo</Link></p>
                    </div>
                )}

                <div className="bg-white p-4 mt-4 buzon-mensajes-row w-75 d-flex mb-4">
                    <button className='btn btn-secondary mx-2' onClick={() => setEstado('pendiente')}>Pendientes</button>
                    <button className='btn btn-success mx-2' onClick={() => setEstado('confirmado')}>Aceptados</button>
                    <button className='btn btn-primary mx-2' onClick={() => setEstado('activo')}>Activos</button>
                    <button className='btn btn-danger mx-2' onClick={() => setEstado('rechazado')}>Rechazados</button>
                    <button className='btn btn-secondary mx-2' onClick={() => setEstado('finalizado')}>Finalizados</button>
                </div>
            </div>
        </div>
    )
}
