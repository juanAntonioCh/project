import { useState, useEffect, useContext } from "react";
import { VehiclesContext } from "./VehiclesContext";
import axios from 'axios'
import { getAllVehicles } from "../api/vehicle.api";
import { AuthContext } from "./AuthContext";

export const VehiclesProvider = ({ children }) => {
    const [vehiculosVisibles, setVehiculosVisibles] = useState([]);
    const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
    const { user } = useContext(AuthContext);
    const [vehiculos, setVehiculos] = useState([])
    const [map, setMap] = useState(null);
    const [maxPrice, setMaxPrice] = useState(100);
    const [minPrice, setMinPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 90]);

    const coordenadas = JSON.parse(localStorage.getItem('coordenadas'))
    //console.log('Estas son las coordenandas: ', coordenadas)

    useEffect(() => {
        async function loadVehicles() {
            const res = await getAllVehicles()
            console.log(res.data)
            setVehiculos(res.data)
        }
        loadVehicles()
    }, [])

    useEffect(() => {
        console.log(vehiculos)
        if (vehiculos.length > 0) {
            const vehisFiltrados = filtrarVehiculosVisibles();
            setVehiculosVisibles(vehisFiltrados);
            setVehiculosFiltrados(vehisFiltrados);
        }
    }, [vehiculos])

    const defaultCenter = {
        lat: coordenadas.lat, lng: coordenadas.lng
    }

    const calcularRadio = (zoom) => {
        const radioBase = 0.013;
        return radioBase * Math.pow(2, (21 - zoom));
    }

    function distanciaEntreDosPuntos(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en kilómetros
        const rad = Math.PI / 180;
        const deltaLat = (lat2 - lat1) * rad;
        const deltaLng = (lng2 - lng1) * rad;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en kilómetros
    }

    //Funcion para mostrar tan solo los vehiculos que se encuentren en la ubicación seleccionada, no pertenezcan al 
    //usuario que tiene la sesión activa y estén disponibles, es decir, no los haya alquilado nadie
    const filtrarVehiculosVisibles = () => {
        if (!map) return [];

        const zoom = map.getZoom();
        //const center = map.getCenter();
        const radioVisible = calcularRadio(zoom);

        return vehiculos.filter(vehiculo => {
            const distancia = distanciaEntreDosPuntos(defaultCenter.lat, defaultCenter.lng, vehiculo.latitud, vehiculo.longitud);
            return distancia <= radioVisible && vehiculo.propietario != user && vehiculo.disponible;
        })
    }


    function handleChanges(e, newValue) {
        //console.log(newValue)
        setPriceRange(newValue);
    }


    const calcularPrecioAlquiler = (precioPorHora, rentDuration) => {
        const { hours, minutes } = rentDuration;
        const totalMinutes = hours * 60 + minutes;
        const precioTotal = (totalMinutes / 60) * precioPorHora;
        return precioTotal.toFixed(2);
    };


    return (
        <VehiclesContext.Provider value={{
            vehiculosFiltrados, vehiculosVisibles, setVehiculosVisibles, priceRange, setPriceRange, maxPrice, minPrice, setMinPrice,
            handleChanges, calcularPrecioAlquiler, filtrarVehiculosVisibles, setMap, setMaxPrice, defaultCenter
        }}>
            {children}
        </VehiclesContext.Provider>
    )
}