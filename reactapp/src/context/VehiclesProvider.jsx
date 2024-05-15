import { useState, useEffect, useContext } from "react";
import { VehiclesContext } from "./VehiclesContext";
import axios from 'axios'
import { getAllVehicles } from "../api/vehicle.api";
import { AuthContext } from "./AuthContext";

export const VehiclesProvider = ({ children }) => {
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
    const [marca, setMarca] = useState(0)

    const handleMarcasSeleccionadasChange = (marca) => {
        const index = marcasSeleccionadas.indexOf(marca);
        if (index === -1) {
            // Si la marca no está seleccionada, añadirla a la lista
            setMarcasSeleccionadas([...marcasSeleccionadas, marca]);
        } else {
            // Si la marca ya está seleccionada, quitarla de la lista
            const nuevasMarcas = [...marcasSeleccionadas];
            nuevasMarcas.splice(index, 1);
            setMarcasSeleccionadas(nuevasMarcas);
        }
    }

    useEffect(()=>{
        handleMarcasSeleccionadasChange(Number(marca))
    }, [marca])

    const calcularPrecioAlquiler = (precioPorHora, rentDuration) => {
        const { hours, minutes } = rentDuration;
        const totalMinutes = hours * 60 + minutes;
        const precioTotal = (totalMinutes / 60) * precioPorHora;
        return precioTotal.toFixed(2);
    };

    return (
        <VehiclesContext.Provider value={{calcularPrecioAlquiler, marca, setMarca, marcasSeleccionadas, setMarcasSeleccionadas, handleMarcasSeleccionadasChange}}>
            {children}
        </VehiclesContext.Provider>
    )
}