import React, { useContext, useEffect, useState } from 'react'
import Slider from '@mui/material/Slider';
import { Button, Modal } from 'react-bootstrap';
import { getAllMarcas } from '../api/vehicle.api';
import '../styles/Filtros.css'
import { UseFiltros } from '../hooks/UseFiltros';
import { VehiclesContext } from '../context/VehiclesContext';


export const Filtros = ({ priceRange, handleChanges, minPrice, maxPrice }) => {
    const { showMarca, showCarroceria, listMarcas, handleCloseMarca, handleCloseCarroceria, handleShowCarroceria, handleShowMarca,
        handleMarcaChange, aplicarFiltrosGlobal, tipoCarroceriaChoices, tipoCombustibleChoices, tipoCambioChoices, marcasSeleccionadas, setMarcasSeleccionadas, handleCambioChange,
        marca, setMarca, handleCarroceriaChange, carroceriasSeleccionadas, handleCloseCambio, handleShowCambio, combustiblesSeleccionados,
        showCambio, cambiosSeleccionados, handleCloseMoreFilters, handleShowMoreFilters, showMoreFilters, handleNumPlazasChange, numPlazas,
        handleCombustibleChange } = UseFiltros()

    //const { vehiculosFiltrados, vehiculosIniciales } = useContext(VehiclesContext)

    return (
        <div className='d-flex filtros'>
            <Slider value={priceRange} onChange={handleChanges} valueLabelDisplay="auto" min={minPrice} max={maxPrice} style={{ width: '300px', marginLeft: '30px' }} />

            <Button variant="btn btn-light" onClick={handleShowMarca} className='mx-5 mb-3'>
                Marca
            </Button>

            <Modal show={showMarca} onHide={handleCloseMarca} className='filtros-marcas-container'>
                <Modal.Header closeButton>
                    <Modal.Title>Marcas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="filtros-marca-container row">
                        {listMarcas.map((marca) => (
                            <div className='col-5' key={marca.id}>
                                <input
                                    type="checkbox"
                                    id={marca.id}
                                    name={marca.nombre}
                                    value={marca.id}
                                    checked={marcasSeleccionadas.includes(marca.id)}
                                    onChange={handleMarcaChange}
                                />
                                <label htmlFor={marca.id} className="checkbox-label">{marca.nombre}</label>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMarca}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={aplicarFiltrosGlobal}>
                        Aplicar filtros
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button variant="btn btn-light" onClick={handleShowCarroceria} className='mx-2 mb-3'>
                Tipo de carrocería
            </Button>

            <Modal show={showCarroceria} onHide={handleCloseCarroceria}>
                <Modal.Header closeButton>
                    <Modal.Title>Tipo de carrocería</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="filtros-carro-container row">
                        {tipoCarroceriaChoices.map((carro) => (
                            <div className='col-5' key={carro[0]}>
                                <input
                                    type="checkbox"
                                    id={carro[0]}
                                    name={carro[0]}
                                    value={carro[0]}
                                    checked={carroceriasSeleccionadas.includes(carro[0])}
                                    onChange={handleCarroceriaChange}
                                />
                                <label htmlFor={carro[0]}>{carro[1]}</label>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCarroceria}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={aplicarFiltrosGlobal}>
                        Aplicar filtros
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button variant="btn btn-light" onClick={handleShowCambio} className='mx-2 mb-3'>
                Tipo de cambio
            </Button>

            <Modal show={showCambio} onHide={handleCloseCambio}>
                <Modal.Header closeButton>
                    <Modal.Title>Tipo de cambio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="filtros-cambio-container row">
                        {tipoCambioChoices.map((cambio) => (
                            <div className='col-5' key={cambio[0]}>
                                <input
                                    type="checkbox"
                                    id={cambio[0]}
                                    name={cambio[0]}
                                    value={cambio[0]}
                                    checked={cambiosSeleccionados.includes(cambio[0])}
                                    onChange={handleCambioChange}
                                />
                                <label htmlFor={cambio[0]}>{cambio[1]}</label>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCambio}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={aplicarFiltrosGlobal}>
                        Aplicar filtros
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button variant="btn btn-light" onClick={handleShowMoreFilters} className='mx-3 mb-3'>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" svg-inline="" className="mx-2" role="presentation" focusable="false" ><path fillRule="evenodd" clipRule="evenodd" d="M14.296 8.215c1.918-.523 4.069.604 4.964 2.326.1.192.18.384.239.577 1.068 0 2.164.034 3.291.13 1.285.11 1.115 2.103-.17 1.993a36.48 36.48 0 00-3.136-.123c-.08.248-.185.484-.312.706-.52.904-1.417 1.602-2.422 1.858-1.177.3-2.5.384-3.55-.234-.743-.438-1.203-1.13-1.414-2.004a32.89 32.89 0 01-3.98-.205c-2.036-.226-5-.336-6.431-.13-1.277.184-1.562-1.795-.286-1.98 1.692-.243 4.863-.108 6.937.122 1.232.137 2.42.202 3.66.194.191-1.588 1.328-2.88 2.61-3.23zm3.19 3.249c-.465-.893-1.647-1.597-2.664-1.32-1.138.31-1.771 2.895-.608 3.58 1.307.77 4.188-.499 3.272-2.26zM8.547.776c1.295.35 2.647 1.314 2.914 2.87 3.764-.626 7.51-.572 11.272-.02 1.276.188.986 2.167-.29 1.98-3.7-.544-7.34-.577-10.977.07-.21.88-.837 2.043-2.346 2.479-1.974.57-4.204.072-5.12-1.895-.94-.01-1.821-.028-2.768-.028-1.29 0-1.29-2 0-2 .748 0 1.545.013 2.317.022a6.976 6.976 0 01-.002-.457c.07-2.43 2.927-3.581 5-3.021zm-.521 1.93c-.86-.231-1.663-.048-2.088.408-.75.804-.456 2.298.365 2.933.429.331 1.16.505 2.262.186 1.916-.553 1.186-3.119-.54-3.526zM4.23 18.028c.719-1.35 2.215-1.906 3.507-1.903 1.282.003 2.783.563 3.408 1.963.079.177.157.368.227.57 1.776.087 3.497.051 5.278.047 1.96-.004 3.966.03 6.054.337 1.276.188.985 2.166-.29 1.98-1.934-.285-3.818-.321-5.76-.317-1.637.004-3.334.038-5.082-.036-.141.734-.55 1.547-1.493 2.117-1.26.76-2.628 1.017-3.844.508-1.002-.42-1.713-1.28-2.128-2.394-.905.073-1.785.132-2.758.132-1.29 0-1.29-2 0-2 .885 0 1.687-.052 2.56-.123.071-.31.183-.62.32-.88zm3.503.097c-.82-.002-1.477.353-1.737.843-.106.197-.19.582-.154.814.256 1.075.722 1.481 1.165 1.667.445.186 1.13.173 2.039-.376 1.545-.932-.002-2.945-1.313-2.948z" fill="#1B2530"></path></svg>
                Más filtros
            </Button>


            <Modal show={showMoreFilters} onHide={handleCloseMoreFilters}>
                <Modal.Header closeButton>
                    <Modal.Title>Más filtros</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Tipo de combustible</h5>
                    {tipoCombustibleChoices.map((combus) => (
                        <div className='col-5' key={combus[0]}>
                            <input
                                type="checkbox"
                                id={combus[0]}
                                name={combus[0]}
                                value={combus[0]}
                                checked={combustiblesSeleccionados.includes(combus[0])}
                                onChange={handleCombustibleChange}
                            />
                            <label htmlFor={combus[0]}>{combus[1]}</label>
                        </div>
                    ))}
                    <hr />
                    <h5>Numero de asientos</h5>
                    <input
                        type="number"
                        onChange={handleNumPlazasChange}
                        placeholder="Ingrese el número de asientos"
                        min={1}
                        max={9}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMoreFilters}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={aplicarFiltrosGlobal}>
                        Aplicar filtros
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}
