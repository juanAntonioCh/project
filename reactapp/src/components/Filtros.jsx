import React, { useEffect, useState } from 'react'
import Slider from '@mui/material/Slider';
import { Button, Modal } from 'react-bootstrap';
import { getAllMarcas } from '../api/vehicle.api';
import '../styles/Filtros.css'
import { UseFiltros } from '../hooks/UseFiltros';


export const Filtros = ({ priceRange, handleChanges, minPrice, maxPrice }) => {
    const { marca, showMarca, showCarroceria, listMarcas, handleCloseMarca, handleCloseCarroceria, handleShowCarroceria, handleShowMarca,
        handleMarcaChange, isMarcaSeleccionada } = UseFiltros()
    
    


    console.log('la MARCA ESDE FILTROS ', marca)

    return (
        <div className='d-flex filtros'>
            <Slider value={priceRange} onChange={handleChanges} valueLabelDisplay="auto" min={minPrice} max={maxPrice} style={{ width: '300px', marginLeft: '30px' }} />

            <Button variant="btn btn-dark" onClick={handleShowMarca} className='mx-5 mb-3'>
                Marca
            </Button>

            <Modal show={showMarca} onHide={handleCloseMarca} className='filtros-marcas-container'>
                <Modal.Header closeButton>
                    <Modal.Title>Marcas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="filtros-marca-container">
                        {listMarcas.map((marca) => (
                            <div key={marca.id}>
                                <button
                                    onClick={() => handleMarcaChange(marca.id)}
                                    className={`filtros-marca ${isMarcaSeleccionada(marca.id) ? 'seleccionado' : ''}`}
                                    value={marca.id}
                                >
                                    {marca.nombre}
                                </button>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMarca}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleCloseMarca}>
                        Aplicar filtros
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button variant="btn btn-dark" onClick={handleShowCarroceria} className='mx-2 mb-3'>
                Tipo de carrocería
            </Button>

            <Modal show={showCarroceria} onHide={handleCloseCarroceria}>
                <Modal.Header closeButton>
                    <Modal.Title>Filtros</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p>Tipos de carroceria</p>
                    <p>Opción de filtro 2</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCarroceria}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleCloseCarroceria}>
                        Aplicar filtros
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}
