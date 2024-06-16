import React from 'react'
import { useLocation } from 'react-router-dom';
import { Mapa } from '../components/Mapa'


export const VehiclesPage = () => {
    const location = useLocation()
    const rentDuration = location.state && location.state.rentDuration
    const address = location.state && location.state.address

    //console.log('Desde vehicles Page: ', rentDuration)
    return ( 
        <div>
            {/* <div className="container-fluid"> */}
            {/* <Navbar /> */}
            <Mapa rentDuration={rentDuration} address={address}/>
        </div>
    )

}
