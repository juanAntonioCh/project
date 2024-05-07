import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export const FiltrosModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Más filtros
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filtros</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí puedes colocar tus opciones de filtro */}
          <p>Marca</p>
          <p>Opción de filtro 2</p>
          {/* Agrega más opciones de filtro según sea necesario */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Aplicar filtros
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
