import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export const AlquilerCard = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className='btn btn-success' variant="secondary" onClick={handleShow}>
        Alquilar
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Revisión del alquiler</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Alquilar: </p>
          <p>Precio Total: </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Confirmar Alquiler
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
