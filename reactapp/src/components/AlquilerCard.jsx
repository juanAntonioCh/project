import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/vehicle.api';
import { Link } from 'react-router-dom';

export const AlquilerCard = ({ setSuccessMessage, setErrorMessage, setWarningMessage, propietario, vehi, fechaInicio, fechaFin, precio }) => {
  const [show, setShow] = useState(false);
  const { user } = useContext(AuthContext)

  //se estaban restando dos horas en la fecha de inicio y fin debido a la diferencia de huso horario entre 
  //la zona local y el Tiempo Universal Coordinado (UTC). Esta funcion lo ha arreglado
  const formatLocalDateTime = (date) => {
    const pad = (num) => (num < 10 ? '0' + num : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const [reserva, setReserva] = useState({
    solicitante: null,
    propietario: propietario,
    vehiculo: vehi,
    fecha_inicio: formatLocalDateTime(fechaInicio),
    fecha_fin: formatLocalDateTime(fechaFin),
    //fecha_inicio: fechaInicio,
    //fecha_fin: fechaFin,
    fecha_confirmacion: null,
    precio_total: precio,
    mensaje: '',
  })

  useEffect(()=>{
    setReserva({
      ...reserva,
      solicitante: user.id
    })
  }, [user])

  console.log(user)
  console.log(reserva)

  const handleChange = (e) => {
    setReserva({
      ...reserva,
      mensaje: e.target.value
    })
  }

  const handleSubmit = async () => {
    setShow(false);
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Token ${token}`
    };

    try {
      const response = await api.post('/api/alquiler/', reserva, { headers })
      console.log(response)
      setSuccessMessage(`Solicitud enviada con éxito. Puedes consultar el estado de la solicitud en el apartado 'Mis alquileres' de tu panel de usuario.`)

    } catch (error) {
      console.error(error)
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.detail); // Mostrar el mensaje de advertencia específico
      } else if (error.response && error.response.status === 401) {
        setWarningMessage(
          <>
            Debes <Link to='/login'>iniciar sesión</Link> para solicitar una reserva.
          </>
        ); // Mostrar mensaje de error de autenticación
      } else {
        setErrorMessage('Error al crear la reserva.'); // Mostrar mensaje de error genérico
      }
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button className='btn vehicle-detail-rent-btn w-100' onClick={handleShow}>
        Solicitar reserva
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Se le notificará al propietario del vehículo esta nueva solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Si quieres, puedes enviar un mensaje al propietario junto con la solicitud de reserva</p>
          <textarea className="form-control" onChange={handleChange} rows="4"></textarea>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
