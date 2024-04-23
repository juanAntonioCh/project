import React from 'react'
import { Navbar } from '../components/Navbar'
import { VehicleList } from '../components/VehicleList'
import { Mapa } from '../components/Mapa'


export const VehiclesPage = () => {
    return ( 
        <div>
            {/* <div className="container-fluid"> */}
            <Navbar />
            <Mapa />
        </div>
    )

}
