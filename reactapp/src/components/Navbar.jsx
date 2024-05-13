import React, { useContext } from 'react';
import { LogoSvg } from './LogoSvg';
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { BuscadorUbiComponent } from './BuscadorUbiComponent';
import { AuthContext } from '../context/AuthContext';
import { UserMenu } from './UserMenu';

export const Navbar = ({ option }) => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);

    // Función para renderizar las opciones de autenticación
    const renderNavOptions = () => {
        if (option === 'HOME') {
            return (
                <div className="home-auth-links">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/register" className="home-auth-link m-2">Regístrate aquí</Link>
                            <Link to="/login" className="home-auth-link m-2">Iniciar sesión</Link>
                        </>
                    ) : (
                        <div className='d-flex align-items-center'>
                            {/* <div className="home-rent">
                                <Link to="/rent-car" className="home-rent-link m-4">Alquila tu coche</Link>
                                <Link to={`/my-vehicles/${user}`} className='btn btn-info'>Mis vehiculos publicados</Link>
                                <button onClick={logout} className="btn btn-danger">Cerrar sesión</button>
                            </div> */}
                            <Link to="/rent-car" className="home-rent-link flex-fill mx-4">Alquila tu coche</Link>
                            <UserMenu handleLogout={logout}/>

                        </div>
                    )}
                </div>
            );
        } else if (option === 'VEHICLE PAGE') {
            return (
                <div className="nav-buscador-ubis-container ">
                    <BuscadorUbiComponent />
                </div>
            )
        } else {
            return null
        }
    };

    return (
        <nav className="navbar d-flex align-items-center">
            <div>
                <span className="navbar-brand">
                    <LogoSvg width={'75px'} height={'75px'} />
                </span>
            </div>
            {renderNavOptions()}

        </nav>
    );
};
