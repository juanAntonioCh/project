import { useState, useEffect } from "react";
import '../styles/BuzonMensajes.css'
import { Carousel, Button, Container, Row, Col, Card } from 'react-bootstrap';
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

  useEffect(() => {
    console.log(reservas)
  }, [reservas])


  return (
    <div className="login-body d-flex justify-content-center">

      <div className="container pt-4 ">

        <div className="bg-white p-4 buzon-mensajes-row">
          <h2 className="text-center">Solicitudes de reservas</h2>
          {reservas.map(reserva => (
            <div key={reserva.id} className="row my-4">
              <div className="col-md-6">
                <div id={`carousel${reserva.id}`} className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {reserva.vehiculo_details.imagenes.map((imagen, index) => (
                      <div key={imagen.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                          className="d-block w-100"
                          src={imagen.imagen}
                          alt={`Imagen ${imagen.id + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${reserva.id}`} data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target={`#carousel${reserva.id}`} data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Información de la Reserva</h5>
                    <p className="card-text">
                      <strong>Fecha de Inicio:</strong> {new Date(reserva.fecha_inicio).toLocaleString()}<br />
                      <strong>Fecha de Fin:</strong> {new Date(reserva.fecha_fin).toLocaleString()}<br />
                      <strong>Fecha de Solicitud:</strong> {new Date(reserva.fecha_solicitud).toLocaleString()}<br />
                      <strong>Mensaje:</strong> {reserva.mensaje}<br />
                      <strong>Estado:</strong> {reserva.estado}
                    </p>
                    {reserva.estado === 'pendiente' && (
                      <>
                        <button className="btn btn-success" onClick={() => handleAceptarReserva(reserva.id)}>Aceptar</button>
                        <button className="btn btn-danger ms-2" onClick={() => handleRechazarReserva(reserva.id)}>Rechazar</button>
                      </>
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