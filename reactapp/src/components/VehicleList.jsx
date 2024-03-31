import React from 'react'
import { useEffect } from 'react'
import { getAllVehicles } from '../api/vehicle.api'

export const VehicleList = () => {

    useEffect(() => {
        async function loadVehicles(){
            const res = await getAllVehicles()
            console.log(res)
        }
        loadVehicles()
        
        console.log('holiiii')
    }, [])

    return (
        <div>VehicleList</div>
    )
}
