import React, { useEffect, useState } from 'react'
import { api } from '../api/vehicle.api';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el idioma español

export const AlquileresUser = () => {
    const [reservas, setReservas] = useState([]);
    const [estado, setEstado] = useState('pendiente');
    dayjs.locale('es');

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

    const formatCustomDate = (dateString) => {
        const date = dayjs(dateString);
        const dateAdjusted = date.subtract(2, 'hour');
        const day = dateAdjusted.format('D');
        const month = dateAdjusted.format('MMMM');
        const year = dateAdjusted.format('YYYY');
        const hour = dateAdjusted.format('H');
        const minute = dateAdjusted.format('mm');

        return `el día ${day} de ${month} de ${year} a las ${hour}:${minute}`;
    };


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

            <div className="container pt-3 pb-5">
                <div className="justify-content-center mb-3">
                    <div className="col-12 col-lg-10 p-3 bg-white rounded">
                        <div className="row justify-content-center">
                            <button className='btn btn-secondary col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('pendiente')}>Pendientes</button>
                            <button className='btn btn-success col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('confirmado')}>Aceptados</button>
                            <button className='btn btn-primary col-4 col-md-2 mb-3 mb-md-0 mx-1' onClick={() => setEstado('activo')}>Activos</button>
                            <button className='btn btn-danger col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('rechazado')}>Rechazados</button>
                            <button className='btn btn-secondary col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('finalizado')}>Finalizados</button>
                        </div>
                    </div>
                </div>

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
                                            <h4 className="card-title">{reserva.vehiculo_details.marca_details.nombre} {reserva.vehiculo_details.modelo_details.nombre}</h4>
                                            <p className="card-text col-5">
                                                <strong>Propietario:</strong> {reserva.vehiculo_details.propietario_details.username}<br />
                                                <strong>Fecha de inicio:</strong> {formatDate(reserva.fecha_inicio)}<br />
                                                <strong>Fecha de fin:</strong> {formatDate(reserva.fecha_fin)}<br />
                                                <strong>Fecha de la solicitud:</strong> {new Date(reserva.fecha_reserva).toLocaleString()}<br />
                                                <strong>Precio final:</strong> {reserva.precio_total} €<br />
                                            </p>
                                            <div className="col-7 d-flex flex-column justify-content-evenly">
                                                {reserva.estado === 'pendiente' && (
                                                    <h4>En espera de que {reserva.vehiculo_details.propietario_details.username} acepte la solicitud ...</h4>
                                                )}
                                                {reserva.estado === 'confirmado' && (
                                                    <h4><i>Solicitud de alquiler aceptada, {formatCustomDate(reserva.fecha_inicio)} iniciará el alquiler de este vehículo</i> </h4>
                                                )}
                                                {reserva.estado === 'rechazado' && (
                                                    <h4>{reserva.vehiculo_details.propietario_details.username} ha rechazado tu solicitud </h4>
                                                )}
                                                {reserva.estado === 'activo' && (
                                                    <h4>Alquiler en curso ...</h4>
                                                )}
                                                {reserva.estado === 'finalizado' && (
                                                    <h4><i>Este alquiler finalizó {formatCustomDate(reserva.fecha_fin)}</i></h4>
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
                        <p className='text-center'><Link to='/home'>Busca un vehículo</Link></p>
                    </div>
                )}
            </div>
        </div>
    )
}
