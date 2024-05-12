import React from 'react';
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

export const Navbar = () => {

    return (
        <nav className="navbar d-flex justify-content-between">
            <div className="d-flex align-items-center">
                <a className="navbar-brand" href="#">
                    <LogoSvg width={'80px'} height={'80px'} />
                </a>
                <div className="nav-buscador-ubis-container">
                    <BuscadorUbiComponent />
                </div>
            </div>
            {/* <div className="d-flex align-items-center">
                <div className="nav-rent">
                    <Link to="/rent-car" className="nav-rent-link">Alquila tu coche</Link>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="#007bff" className="bi bi-person-circle nav-svg" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
            </div> */}
        </nav>


    )
}
