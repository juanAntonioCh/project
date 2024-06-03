import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const UserMenu = ({ handleLogout }) => {
    const { user } = useContext(AuthContext);
    return (
        <Dropdown className='mx-4'>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="lightgrey" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <p className='mx-3'>¡Bienvenido! <strong className='mx-2 fs-5'> <i>{user.username}</i></strong></p>
                <Dropdown.Item href={`/my-vehicles/${user.id}`}>Mis vehiculos publicados</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Mis alquileres</Dropdown.Item>
                <Dropdown.Item href={'/mensajes/'}>Solicitudes de reserva recibidas</Dropdown.Item>
                <Dropdown.Item href={'/mensajes/'}>Solicitudes de reserva enviadas</Dropdown.Item>
                <hr />
                <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};
