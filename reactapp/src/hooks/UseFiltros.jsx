import React, { useContext, useEffect, useState } from 'react'
import { getAllMarcas } from '../api/vehicle.api';
import { VehiclesContext } from '../context/VehiclesContext';



export const UseFiltros = () => {
    const [showMarca, setShowMarca] = useState(false);
    const [showCarroceria, setShowMarcaCarroceria] = useState(false);
    const [listMarcas, setListMarcas] = useState([]);
    const { marca, setMarca, marcasSeleccionadas, setMarcasSeleccionadas } = useContext(VehiclesContext)

    const handleCloseMarca = () => setShowMarca(false);
    const handleShowMarca = () => setShowMarca(true);

    const handleCloseCarroceria = () => setShowMarcaCarroceria(false);
    const handleShowCarroceria = () => setShowMarcaCarroceria(true);

    useEffect(() => {
        async function loadMarcas() {
            const list_marcas = await getAllMarcas()
            setListMarcas(list_marcas.data)
        }
        loadMarcas()
    }, [])

    const handleMarcaChange = (e) => {
        setMarca(e)
    }

    useEffect(() => {
        console.log(listMarcas)
    }, [listMarcas])

    const isMarcaSeleccionada = (marcaId) => {
        return marcasSeleccionadas.includes(marcaId);
    };


    return {
        showMarca, showCarroceria, listMarcas, handleCloseMarca, handleCloseCarroceria, handleShowCarroceria, handleShowMarca,
        handleMarcaChange, marca, isMarcaSeleccionada
    }

}
