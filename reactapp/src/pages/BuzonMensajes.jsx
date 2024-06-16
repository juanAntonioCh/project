import { useState, useEffect } from "react";
import '../styles/BuzonMensajes.css'
import { api } from "../api/vehicle.api";
import dayjs from "dayjs";

export const BuzonMensajes = () => {
  const [reservas, setReservas] = useState([]);
  const [estado, setEstado] = useState('pendiente');
  //para que el mes aparezca en español
  dayjs.locale('es');

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Token ${token}`
      };
      try {
        const response = await api.get(`/api/alquileres/propietario/?estado=${estado}`, { headers })
        setReservas(response.data);
      } catch (error) {
        console.error('Error al obtener las reservas del propietario:', error);
      }
    }
    fetchReservas();
  }, [estado]);

  const handleAceptarReserva = async (reservaId) => {
    const confirmacion = window.confirm("¿Estás seguro de confirmar esta reserva?");
    if (confirmacion) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Token ${token}`
      }

      try {
        const response = await api.post(`/api/alquiler/${reservaId}/confirmar/`, null, { headers });
        setReservas(response.data);
        //console.log(response.data);

      } catch (error) {
        console.error('Error al confirmar la reserva:', error);
      }
    }
  }

  const handleRechazarReserva = async (reservaId) => {
    const confirmacion = window.confirm("¿Estás seguro de rechazar esta reserva?");
    if (confirmacion) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Token ${token}`
      }

      try {
        const response = await api.post(`/api/alquiler/${reservaId}/rechazar/`, null, { headers });
        //console.log(response.data);
        setReservas(prevReservas => prevReservas.filter(reserva => reserva.id !== reservaId));
        //setReservas(nuevasReservas)
      } catch (error) {
        console.error('Error al rechazar la reserva:', error);
      }
    }
  }

  const formatCustomDate = (dateString) => {
    const date = dayjs(dateString);
    const dateAdjusted = date.subtract(2, 'hour');
    const day = dateAdjusted.format('D');
    const month = dateAdjusted.format('MMMM');
    const year = dateAdjusted.format('YYYY');
    const hour = dateAdjusted.format('H');
    const minute = dateAdjusted.format('mm');

    return `El día ${day} de ${month} de ${year} a las ${hour}:${minute}`;
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
    //console.log(reservas)
  }, [reservas])

  return (
    <div className="login-body d-flex justify-content-center">
      <div className="container pt-3 pb-4">

        <div className="justify-content-center mb-3">
          <div className="col-12 col-lg-10 p-3 bg-white rounded">
            <div className="row justify-content-center">
              <button className='btn btn-secondary col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('pendiente')}>Pendientes</button>
              <button className='btn btn-success col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('confirmado')}>Aceptadas</button>
              <button className='btn btn-primary col-4 col-md-2 mb-3 mb-md-0 mx-1' onClick={() => setEstado('activo')}>Activas</button>
              <button className='btn btn-danger col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('rechazado')}>Rechazadas</button>
              <button className='btn btn-secondary col-4 col-md-2 mb-2 mb-md-0 mx-1' onClick={() => setEstado('finalizado')}>Finalizadas</button>
            </div>
          </div>
        </div>

        {reservas.length > 0 ? (
          <div className="bg-white p-4 buzon-mensajes-row">
            {reservas.map(reserva => (
              <div key={reserva.id} className="row my-4">
                <div className="col-12 col-lg-2">
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

                <div className="col-12 col-lg-10">
                  <div className="card">
                    <div className="card-body row">
                      <h5 className="card-title">{reserva.vehiculo_details.marca_details.nombre} {reserva.vehiculo_details.modelo_details.nombre}</h5>
                      <p className="card-text col-lg-4">
                        <strong>Solicitante:</strong> {reserva.solicitante_details.username} <br />
                        <strong>Fecha de inicio:</strong> {formatDate(reserva.fecha_inicio)}<br />
                        <strong>Fecha de fin:</strong> {formatDate(reserva.fecha_fin)}<br />
                        <strong>Fecha de la solicitud:</strong> {formatDate(reserva.fecha_reserva)}<br />
                        {/* <strong>Fecha de la solicitud:</strong> {new Date(reserva.fecha_reserva).toLocaleString()}<br /> */}
                        <strong>Precio final:</strong> {reserva.precio_total} €<br />
                      </p>
                      {reserva.mensaje.length > 0 ? (
                        <div className="form-group col-lg-4">
                          <label htmlFor="mensaje"><em>Mensaje de {reserva.solicitante_details.username}:</em></label>
                          <textarea
                            className="form-control "
                            id="mensaje"
                            rows="4"
                            value={reserva.mensaje}
                            readOnly
                          />
                        </div>

                      ) : (
                        <div className="col-2"></div>
                      )}

                      <div className="col-4 d-flex flex-column justify-content-evenly">
                        {reserva.estado === 'pendiente' && (
                          <>
                            <button className="btn btn-success w-75 align-self-center" onClick={() => handleAceptarReserva(reserva.id)}>Aceptar</button>
                            <button className="btn btn-danger w-75 align-self-center" onClick={() => handleRechazarReserva(reserva.id)}>Rechazar</button>
                          </>
                        )}
                        {reserva.estado === 'confirmado' && (
                          <>
                            <h4>Has aceptado esta solicitud</h4>
                            <p className="fs-5"><i>{formatCustomDate(reserva.fecha_inicio)} iniciará el alquiler de este vehículo</i>  </p>
                          </>
                        )}
                        {reserva.estado === 'activo' && (
                          <h2>Alquiler en curso ...</h2>
                        )}
                        {reserva.estado === 'rechazado' && (
                          <h4 className="text-center mt-2">Has rechazado esta reserva</h4>
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
            {estado == 'pendiente' && (<h3 className='text-center'>No tienes ninguna solicitud de alquiler pendiente</h3>)}
            {estado == 'confirmado' && (<h3 className='text-center' >No tienes ninguna solicitud de alquiler aceptada</h3>)}
            {estado == 'activo' && (<h3 className='text-center'>No tienes ningún vehículo alquilado actualmente</h3>)}
            {estado == 'rechazado' && (<h3 className='text-center'>No tienes ninguna solicitud de alquiler rechazada</h3>)}
            {estado == 'finalizado' && (<h3 className='text-center'>No tienes ninguna solicitud de alquiler finalizada</h3>)}
          </div>
        )}
      </div>
    </div>
  )
}