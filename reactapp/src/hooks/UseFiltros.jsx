import React, { useContext, useEffect, useState } from 'react'
import { getAllMarcas, getAllModelos, getVehicleChoices } from '../api/vehicle.api';
import { VehiclesContext } from '../context/VehiclesContext';


export const UseFiltros = () => {
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
    const [marca, setMarca] = useState(null)
    const [carroceriasSeleccionadas, setCarroceriasSeleccionadas] = useState([]);
    const [carroceria, setCarroceria] = useState(null)
    const [combustiblesSeleccionados, setCombustiblesSeleccionados] = useState([]);
    const [combustible, setCombustible] = useState(null)
    const [cambiosSeleccionados, setCambiosSeleccionados] = useState([]);
    const [cambio, setCambio] = useState(null)
    const [numPlazas, setNumPlazas] = useState(1)

    const [showMarca, setShowMarca] = useState(false);
    const [showCarroceria, setShowCarroceria] = useState(false);
    const [showCambio, setShowCambio] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const [listMarcas, setListMarcas] = useState([]);
    const [tipoCarroceriaChoices, setTipoCarroceriaChoices] = useState([])
    const [tipoCambioChoices, setTipoCambioChoices] = useState([])
    const [tipoCombustibleChoices, setTipoCombustibleChoices] = useState([])

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

    const handleCloseMoreFilters = () => setShowMoreFilters(false);
    const handleShowMoreFilters = () => setShowMoreFilters(true);

    //Obtener el listado de marcas y tipo de carroceria para los filtros
    useEffect(() => {
        async function loadFilterData() {
            const list_marcas = await getAllMarcas()
            const choices = await getVehicleChoices()
            setListMarcas(list_marcas.data)
            setTipoCarroceriaChoices(choices.data.tipo_carroceria)
            setTipoCambioChoices(choices.data.tipo_cambio)
            setTipoCombustibleChoices(choices.data.tipo_combustible)
        }
        loadFilterData()
    }, [])

    useEffect(() => {
        console.log(tipoCarroceriaChoices)
    }, [tipoCarroceriaChoices])


    const incrementarNumPlazas = () => {
        console.log(typeof (numPlazas))
        if (numPlazas < 9) {
            setNumPlazas(prevNumPlazas => prevNumPlazas + 1);
        }
    };

    const decrementarNumplazas = () => {
        if (numPlazas > 1) {
            setNumPlazas(prevNumPlazas => prevNumPlazas - 1);
        }
    };


    const handleMarcaChange = (e) => {
        const marcaId = parseInt(e.target.value);
        console.log(e.target.value)
        if (e.target.checked) {
            setMarcasSeleccionadas([...marcasSeleccionadas, marcaId]);
        } else {
            setMarcasSeleccionadas(marcasSeleccionadas.filter(id => id !== marcaId));
        }
    }

    const handleCombustibleChange = (e) => {
        const combus = e.target.value;
        console.log(e.target.value)
        if (e.target.checked) {
            setCombustiblesSeleccionados([...combustiblesSeleccionados, combus]);
        } else {
            setCombustiblesSeleccionados(combustiblesSeleccionados.filter(e => e !== combus));
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
            let filtroPlazas = numPlazas === '' || vehicle.numero_plazas >= parseInt(numPlazas);
            //let filtroPrecio = precioAlquiler >= priceRange[0] && precioAlquiler <= priceRange[1];
            console.log(vehicle.tipo_combustible)
            let filtroCombustible = combustiblesSeleccionados.length === 0 || combustiblesSeleccionados.includes(vehicle.tipo_combustible);
            let filtroCarroceria = carroceriasSeleccionadas.length === 0 || carroceriasSeleccionadas.includes(vehicle.tipo_carroceria);
            let filtroCambio = cambiosSeleccionados.length === 0 || cambiosSeleccionados.includes(vehicle.tipo_cambio);
            //return filtroMarca && passesPriceRangeFilter && passesBodyTypeFilters && passesSeatingCapacityFilter;
            return filtroMarca && filtroCarroceria && filtroCambio && filtroPlazas && filtroCombustible
        });
        console.log(vehiculosFiltrados)
        setVehiculosFiltrados(vehiculosFiltrados);

        setShowMarca(false);
        setShowCarroceria(false)
        setShowCambio(false)
        setShowMoreFilters(false)
    }


    return {
        showMarca, showCarroceria, showCambio, listMarcas, handleCloseMarca, handleCloseCarroceria, handleShowCarroceria, handleShowMarca,
        handleCloseCambio, handleShowCambio, cambiosSeleccionados, handleCambioChange, handleCloseMoreFilters, handleShowMoreFilters, showMoreFilters,
        handleMarcaChange, aplicarFiltrosGlobal, tipoCarroceriaChoices, tipoCombustibleChoices, tipoCambioChoices, marcasSeleccionadas, setMarcasSeleccionadas,
        marca, setMarca, handleCarroceriaChange, carroceriasSeleccionadas, numPlazas, combustiblesSeleccionados,
        handleCombustibleChange, incrementarNumPlazas, decrementarNumplazas, numPlazas
    }

}
