import { useState, useEffect } from "react";
import '../styles/BuzonMensajes.css'
import { api } from "../api/vehicle.api";

export const BuzonMensajes = () => {
  const [reservas, setReservas] = useState([]);
  const [estado, setEstado] = useState('pendiente');

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
        console.log(response.data);

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
        console.log(response.data);
        setReservas(prevReservas => prevReservas.filter(reserva => reserva.id !== reservaId));
        //setReservas(nuevasReservas)
      } catch (error) {
        console.error('Error al rechazar la reserva:', error);
      }
    }
  }

  useEffect(() => {
    console.log(reservas)
  }, [reservas])


  return (
    <div className="login-body d-flex justify-content-center">

      <div className="container pt-4 pb-4">

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
                      <p className="card-text col-5">
                        <strong>Solicitante:</strong> {reserva.solicitante_details.username} <br />
                        <strong>Fecha de Inicio:</strong> {new Date(reserva.fecha_inicio).toLocaleString()}<br />
                        <strong>Fecha de Fin:</strong> {new Date(reserva.fecha_fin).toLocaleString()}<br />
                        <strong>Fecha de la solicitud:</strong> {new Date(reserva.fecha_reserva).toLocaleString()}<br />
                        <strong>Precio final:</strong> {reserva.precio_total} €<br />
                      </p>
                      <div className="form-group col-5">
                        {/* <label htmlFor="mensaje"><strong>Mensaje del comprador:</strong></label> */}
                        <textarea
                          className="form-control"
                          id="mensaje"
                          rows="4"
                          value={reserva.mensaje}
                          readOnly
                        />
                      </div>

                      <div className="col-2 d-flex flex-column justify-content-evenly">
                        {reserva.estado === 'pendiente' && (
                          <>
                            <button className="btn btn-success" onClick={() => handleAceptarReserva(reserva.id)}>Aceptar</button>
                            <button className="btn btn-danger " onClick={() => handleRechazarReserva(reserva.id)}>Rechazar</button>
                          </>
                        )}
                        {reserva.estado === 'confirmado' && (
                          <h2>ACEPTADO</h2>
                        )}
                        {reserva.estado === 'rechazado' && (
                          <h2>RECHAZADO</h2>
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
            {estado == 'pendiente' && (<h3 className='text-center'>No tienes ninguna solicitud de alquiler</h3>)}
            {estado == 'confirmado' && (<h3 className='text-center' >No tienes ninguna solicitud de alquiler aceptada</h3>)}
            {estado == 'activo' && (<h3 className='text-center'>No tienes ningún vehículo alquilado actualmente</h3>)}
            {estado == 'rechazado' && (<h3 className='text-center'>No tienes ninguna solicitud de alquiler rechazada</h3>)}
          </div>
        )}

        <div className="bg-white p-4 mt-4 buzon-mensajes-row w-75 d-flex mb-4">
          <button className='btn btn-secondary' onClick={() => setEstado('pendiente')}>Pendientes</button>
          <button className='btn btn-success mx-2' onClick={() => setEstado('confirmado')}>Aceptadas</button>
          <button className='btn btn-primary mx-2' onClick={() => setEstado('activo')}>Activas</button>
          <button className='btn btn-danger mx-2' onClick={() => setEstado('rechazado')}>Rechazadas</button>
        </div>
      </div>
    </div>
  )
}