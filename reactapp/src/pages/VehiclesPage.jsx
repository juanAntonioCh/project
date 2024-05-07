import React from 'react'
import { Navbar } from '../components/Navbar'
import { VehicleList } from '../components/VehicleList'
import { Link } from 'react-router-dom';
import { Mapa } from '../components/Mapa'
import { FiltrosModal } from './Filtros';


export const VehiclesPage = () => {
    return ( 
        <div>
            {/* <div className="container-fluid"> */}
            <Navbar />
            <FiltrosModal/>
            <Mapa />
        </div>
    )

}
