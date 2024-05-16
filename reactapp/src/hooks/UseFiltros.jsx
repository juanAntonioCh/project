import React, { useContext, useEffect, useState } from 'react'
import { getAllMarcas, getAllModelos, getVehicleChoices } from '../api/vehicle.api';
import { VehiclesContext } from '../context/VehiclesContext';


export const UseFiltros = () => {
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
    const [marca, setMarca] = useState(null)
    const [carroceriasSeleccionadas, setCarroceriasSeleccionadas] = useState([]);
    const [carroceria, setCarroceria] = useState(null)
    const [cambiosSeleccionados, setCambiosSeleccionados] = useState([]);
    const [cambio, setCambio] = useState(null)

    const [showMarca, setShowMarca] = useState(false);
    const [showCarroceria, setShowCarroceria] = useState(false);
    const [showCambio, setShowCambio] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const [listMarcas, setListMarcas] = useState([]);
    const [tipoCarroceriaChoices, setTipoCarroceriaChoices] = useState([])
    const [tipoCambioChoices, setTipoCambioChoices] = useState([])

    const { vehiculosFiltrados, vehiculosFiltradosMarca, 
        setVehiculosFiltrados, vehiculosIniciales, calcularPrecioAlquiler } = useContext(VehiclesContext)


    const handleCloseMarca = () => {
        //setMarcasSeleccionadas([])
        setShowMarca(false);
    }
    const handleShowMarca = () => setShowMarca(true);

    const handleCloseCarroceria = () => setShowCarroceria(false);
    const handleShowCarroceria = () => setShowCarroceria(true);

    const handleCloseCambio = () => setShowCambio(false);
    const handleShowCambio = () => setShowCambio(true);

    const handleCloseMoreFilters = () => setShowMoreFilters (false);
    const handleShowMoreFilters  = () => setShowMoreFilters (true);

    //Obtener el listado de marcas y tipo de carroceria para los filtros
    useEffect(() => {
        async function loadFilterData() {
            const list_marcas = await getAllMarcas()
            const choices = await getVehicleChoices()
            setListMarcas(list_marcas.data)
            setTipoCarroceriaChoices(choices.data.tipo_carroceria)
            setTipoCambioChoices(choices.data.tipo_cambio)
        }
        loadFilterData()
    }, [])

    useEffect(()=>{
        console.log(tipoCarroceriaChoices)
    }, [tipoCarroceriaChoices])


    const handleMarcaChange = (e) => {
        const marcaId = parseInt(e.target.value);
        console.log(e.target.value)
        if (e.target.checked) {
            setMarcasSeleccionadas([...marcasSeleccionadas, marcaId]);
        } else {
            setMarcasSeleccionadas(marcasSeleccionadas.filter(id => id !== marcaId));
        }
    }

    const handleCarroceriaChange = (e) => {
        const carro = e.target.value;
        console.log(e.target.value)
        if (e.target.checked) {
            setCarroceriasSeleccionadas([...carroceriasSeleccionadas, carro]);
        } else {
            setCarroceriasSeleccionadas(carroceriasSeleccionadas.filter(e => e !== carro));
        }
    }

    const handleCambioChange = (e) => {
        const cambio = e.target.value;
        console.log(e.target.value)
        if (e.target.checked) {
            setCambiosSeleccionados([...cambiosSeleccionados, cambio]);
        } else {
            setCambiosSeleccionados(cambiosSeleccionados.filter(e => e !== cambio));
        }
    }

    
    const aplicarFiltrosGlobal = () => {
        let vehiculosFiltrados = vehiculosIniciales.filter(vehicle => {
            //const precioAlquiler = calcularPrecioAlquiler(vehi.precio_por_hora, rentDuration);
            let filtroMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(vehicle.marca);
            //let filtroPrecio = precioAlquiler >= priceRange[0] && precioAlquiler <= priceRange[1];
            let filtroCarroceria = carroceriasSeleccionadas.length === 0 || carroceriasSeleccionadas.includes(vehicle.tipo_carroceria);
            let filtroCambio = cambiosSeleccionados.length === 0 || cambiosSeleccionados.includes(vehicle.tipo_cambio);
            //return filtroMarca && passesPriceRangeFilter && passesBodyTypeFilters && passesSeatingCapacityFilter;
            return filtroMarca && filtroCarroceria && filtroCambio
        });
        setVehiculosFiltrados(vehiculosFiltrados);
        setShowMarca(false);
        setShowCarroceria(false)
        setShowCambio(false)
    }



    // const aplicarFiltroMarca = (vehiculos) => {
    //     const filtroMarca = () => {
    //         const vehiculosFiltradosMarca = vehiculos.filter(vehi => {
    //             console.log(`La marca del vehiculo es ${typeof vehi.marca} y la marca selecionada es ${typeof marca}`)
    //             console.log(marcasSeleccionadas)
    //             return marcasSeleccionadas.includes(vehi.marca);
    //         });
    //         console.log('EL RESULTADO ESSSS ', vehiculosFiltradosMarca)
    //         setVehiculosFiltrados(vehiculosFiltradosMarca);
    //     };
    //     filtroMarca();
    //     setShowMarca(false);
    // }


    return {
        showMarca, showCarroceria, showCambio, listMarcas, handleCloseMarca, handleCloseCarroceria, handleShowCarroceria, handleShowMarca, 
        handleCloseCambio, handleShowCambio, cambiosSeleccionados, handleCambioChange, handleCloseMoreFilters, handleShowMoreFilters, showMoreFilters,
        handleMarcaChange, aplicarFiltrosGlobal, tipoCarroceriaChoices, tipoCambioChoices, marcasSeleccionadas, setMarcasSeleccionadas,
        marca, setMarca, handleCarroceriaChange, carroceriasSeleccionadas, carroceria
    }

}
