import React, { useContext } from 'react';
import { LogoSvg } from './LogoSvg';
import { useLocation } from 'react-router-dom'
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
    const location = useLocation();
    const { isAuthenticated, logout, user } = useContext(AuthContext);

    // Función para renderizar las opciones de autenticación
    const renderNavOptions = () => {
        if (option === 'VEHICLE PAGE') {
            return (

                <div className="d-flex flex-grow-1 justify-content-start">
                    <div className="nav-buscador-ubis-container mx-4 d-none d-md-block">
                        <BuscadorUbiComponent />
                    </div>
                </div>
            )
        } else {
            return null
        }
    };

    return (
        <nav className="navbar">
            <div>
                <Link to='/' className="navbar-brand">
                    <LogoSvg width={'80px'} height={'80px'} />
                </Link>
            </div>

            {renderNavOptions()}

            <button className="navbar-toggler d-md-none mx-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <LogoSvg width={'110px'} height={'110px'} />
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className='d-flex flex-column'>
                        <Link to="/rent-car" className="w-50 m-2">Alquila tu coche</Link>
                        {!isAuthenticated ? (
                            <>
                                <Link to="/register" className="w-50 m-2">Regístrate aquí</Link>
                                <Link to="/login" className="w-50 m-2">Iniciar sesión</Link>
                            </>
                        ) : (
                            <>
                                <Link to={`/my-vehicles/${user}`} className="w-50 m-2">Mis vehículos</Link>
                                <Link to="#" className="w-50 m-2">Mis alquileres</Link>
                                <hr />
                                <button onClick={logout} className="btn btn-danger m-2">Cerrar sesión</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className='d-none d-md-block'>
                {isAuthenticated ? (
                    <div className="d-flex align-items-center">
                        {location.pathname !== '/rent-car' ? (
                            <Link to="/rent-car" className="home-rent-link flex-fill mx-4">Alquila tu coche</Link>)
                            : null}
                        <UserMenu handleLogout={logout} />
                    </div>

                ) : (
                    <div className="d-flex flex-grow-1 justify-content-end">
                        <div className="home-auth-links d-none d-md-block">
                            {!isAuthenticated && location.pathname !== '/register' && location.pathname !== '/login' ? (
                                <>
                                    {location.pathname !== '/rent-car' ? (
                                        <Link to="/rent-car" className="home-rent-link flex-fill mx-4">Alquila tu coche</Link>)
                                        : null}

                                    <Link to="/register" className="home-auth-link">Regístrate aquí</Link>
                                    <Link to="/login" className="home-auth-link mx-4">Iniciar sesión</Link>
                                </>
                            ) : null}

                        </div>
                    </div>
                )}
            </div>




        </nav>
    );
};
