import { useState } from "react";
import { VehicleContext } from "./VehicleContext";

export const VehicleProvider = ({ children }) => {
    const [vehiculo, setVehiculo] = useState({
        //owner: null,
        marca: '',
        modelo: '',
        año: 0,
        matricula: '',
        description: '',
        tipo_carroceria: '',
        tipo_combustible: '',
        consumo: '',
        kilometraje: '',
        tipo_cambio: '',
        precio_por_hora: '',
        latitud: '',
        longitud: '',
        is_available: false
      })
    

    return (
        <VehicleContext.Provider value={{ setVehiculo, vehiculo }}>
            {children}
        </VehicleContext.Provider>
    )
}