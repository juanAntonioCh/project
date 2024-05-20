import { useState, useEffect } from "react";
import axios from 'axios'
import { getAllMarcas, getAllModelos, getVehicleChoices } from "../api/vehicle.api";

export const useRent = () => {
    const [listMarcas, setListMarcas] = useState([]);
    const [listModelos, setListModelos] = useState([]);

    //Obtetener las marcas y modelos de vehículos. Y los campos choices
    useEffect(() => {
        async function loadData() {
            const list_marcas = await getAllMarcas()
            const list_modelos = await getAllModelos()
            const choices = await getVehicleChoices()

            setListMarcas(list_marcas.data)
            setListModelos(list_modelos.data)

            //setTipoCarroceriaChoices(choices.data.tipo_carroceria)
            //setTipoCambioChoices(choices.data.tipo_cambio)
            //setTipoCombustibleChoices(choices.data.tipo_combustible)

        }
        loadData()
    }, [])

    //actualizar la MARCA del vehiculo cuando se cambie de opción en el formulario
    const handleChangeMarca = (e) => {
        loadModelos(e.target.value)

        setVehiculo({
            ...vehiculo,
            [e.target.name]: Number(e.target.value),
            modelo_id: listModelos[0].id
        })
    }

    //actualizar el MODELO del vehiculo cuando se cambie de opción en el formulario
    const handleChangeModelo = (e) => {
        setVehiculo({
            ...vehiculo,
            [e.target.name]: Number(e.target.value),
        })

    }

    //actualizar el objeto vehiculo cuando haya algun cambio 
    const handleChange = (e) => {
        setVehiculo({
            ...vehiculo,
            [e.target.name]: e.target.value
        })
    }

    return { handleChange, vehiculo, setVehiculo, handleChangeMarca, handleChangeModelo, listMarcas, listModelos }
}