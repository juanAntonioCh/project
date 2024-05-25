import React from 'react'
import { Navbar } from '../components/Navbar'
import { VehicleList } from '../components/VehicleList'
import { Link, useLocation } from 'react-router-dom';
import { Mapa } from '../components/Mapa'


export const VehiclesPage = () => {
    const location = useLocation()
    //console.log(location)
    const rentDuration = location.state && location.state.rentDuration
    const address = location.state && location.state.address

    console.log('Desde vehicles Page: ', rentDuration)
    return ( 
        <div>
            {/* <div className="container-fluid"> */}
            {/* <Navbar /> */}
            <Mapa rentDuration={rentDuration} address={address}/>
        </div>
    )

}
