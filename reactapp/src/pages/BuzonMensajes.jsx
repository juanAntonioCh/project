import { useState, useEffect } from "react";
import '../styles/BuzonMensajes.css'
import { api } from "../api/vehicle.api";

export const BuzonMensajes = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Token ${token}`
      };
      try {
        const response = await api.get('/api/reservas/propietario/', { headers })
        setReservas(response.data);
      } catch (error) {
        console.error('Error al obtener las reservas del propietario:', error);
      }
    }
    fetchReservas();
  }, []);

  const handleAceptarReserva = async (reservaId) => {
    const confirmacion = window.confirm("¿Estás seguro de confirmar esta reserva?");
    if (confirmacion) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Token ${token}`
      }

      try {
        const response = await api.post(`/api/reserva/${reservaId}/confirmar/`, null, { headers });
        console.log(response.data);
        const nuevasReservas = reservas.filter(reserva => reserva.id !== reservaId);
        setReservas(nuevasReservas);
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
        const response = await api.post(`/api/reserva/${reservaId}/rechazar/`, null, { headers });
        console.log(response.data);
        const nuevasReservas = reservas.filter(reserva => reserva.id !== reservaId)
        setReservas(nuevasReservas)
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

      <div className="container pt-4 ">

        <div className="bg-white p-4 buzon-mensajes-row">
          <h2 className="text-center">Solicitudes de reservas</h2>

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
                      <strong>Fecha de la solicitud:</strong> {new Date(reserva.fecha_solicitud).toLocaleString()}<br />
                      <strong>Precio final:</strong> {reserva.precio_total} €<br />
                    </p>
                    <div className="form-group col-4">
                      <label htmlFor="mensaje"><strong>Mensaje del comprador:</strong></label>
                      <textarea
                        className="form-control w-75"
                        id="mensaje"
                        rows="3"
                        value={reserva.mensaje}
                        readOnly
                      />
                    </div>
                    {reserva.estado === 'pendiente' && (
                      <div className="col-3 d-flex flex-column justify-content-evenly">
                        <button className="btn btn-success" onClick={() => handleAceptarReserva(reserva.id)}>Aceptar</button>
                        <button className="btn btn-danger " onClick={() => handleRechazarReserva(reserva.id)}>Rechazar</button>
                      </div>
                    )}
                    {reserva.estado === 'confirmada' && (
                      <div className="col-3 d-flex flex-column justify-content-evenly">
                        <h2>ACEPTADA</h2>
                      </div>
                    )}
                    {reserva.estado === 'rechazada' && (
                      <div className="col-3 d-flex flex-column justify-content-evenly">
                        <h2>RECHAZADA</h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  )
}