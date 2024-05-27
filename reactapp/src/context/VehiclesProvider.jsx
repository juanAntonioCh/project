import { useState, useEffect, useContext } from "react";
import { VehiclesContext } from "./VehiclesContext";
import axios from 'axios'
import { getAllVehicles } from "../api/vehicle.api";
import { AuthContext } from "./AuthContext";

export const VehiclesProvider = ({ children }) => {
    const [vehiculosFiltrados, setVehiculosFiltrados] = useState([])
    const [vehiculosIniciales, setVehiculosIniciales] = useState([])
    const [fromatStartDate, setFormatStartDate] = useState(null);
    const [formatEndDate, setFormatEndDate] = useState(null);

    const calcularPrecioAlquiler = (precioPorHora, rentDuration) => {
        const { hours, minutes } = rentDuration;
        const totalMinutes = hours * 60 + minutes;
        const precioTotal = (totalMinutes / 60) * precioPorHora;
        return precioTotal.toFixed(2);
    };

    return (
        <VehiclesContext.Provider value={{ calcularPrecioAlquiler, fromatStartDate, setFormatStartDate, formatEndDate, setFormatEndDate,
        vehiculosFiltrados, setVehiculosFiltrados, vehiculosIniciales, setVehiculosIniciales }}>
            {children}
        </VehiclesContext.Provider>
    )
}