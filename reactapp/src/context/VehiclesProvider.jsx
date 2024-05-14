import { useState, useEffect, useContext } from "react";
import { VehiclesContext } from "./VehiclesContext";
import axios from 'axios'
import { getAllVehicles } from "../api/vehicle.api";
import { AuthContext } from "./AuthContext";

export const VehiclesProvider = ({ children }) => {

    const calcularPrecioAlquiler = (precioPorHora, rentDuration) => {
        const { hours, minutes } = rentDuration;
        const totalMinutes = hours * 60 + minutes;
        const precioTotal = (totalMinutes / 60) * precioPorHora;
        return precioTotal.toFixed(2);
    };

    return (
        <VehiclesContext.Provider value={{calcularPrecioAlquiler}}>
            {children}
        </VehiclesContext.Provider>
    )
}