import React, { useContext, useEffect, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useNavigate } from 'react-router-dom';
import { api, getAllMarcas, getAllModelos, getModelosMarca, getVehicleChoices } from '../api/vehicle.api'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';

export const EditVehicle = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)
  const { id } = useParams();
  const [listMarcas, setListMarcas] = useState([]);
  const [listModelos, setListModelos] = useState([]);
  const [tipoCarroceriaChoices, setTipoCarroceriaChoices] = useState([])
  const [tipoCambioChoices, setTipoCambioChoices] = useState([])
  const [tipoCombustibleChoices, setTipoCombustibleChoices] = useState([])
  const [imagenes, setImagenes] = useState([])
  //const [successMessage, setSuccessMessage] = useState('')
  const [address, setAddress] = useState('');
  const [ubicacion, setUbicacion] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [vehiculo, setVehiculo] = useState({})

  const obtenerUbicacion = async (latitud, longitud) => {
    try {
      const respuesta = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`);
      const data = await respuesta.json();

      if (data) {
        console.log(data)
        const ubi = data.display_name || 'No disponible';
        setUbicacion(ubi)
        console.log(`La ubicación es en ${ubi}`);
      } else {
        console.log('No se pudo obtener la ubicación');
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  };

  useEffect(() => {
    console.log(vehiculo)
  }, [vehiculo])


  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/api/vehicles/${id}`);
        console.log(data)
        setVehiculo({
          id: data.id,
          propietario_id: data.propietario,
          marca_id: data.marca,
          modelo_id: data.modelo,
          año: data.año,
          matricula: data.matricula,
          descripcion: data.descripcion,
          tipo_carroceria: data.tipo_carroceria,
          tipo_combustible: data.tipo_combustible,
          consumo: data.consumo,
          kilometraje: data.kilometraje,
          tipo_cambio: data.tipo_cambio,
          precio_por_hora: data.precio_por_hora,
          latitud: data.latitud,
          longitud: data.longitud,
          autonomia: data.autonomia,
          numero_plazas: data.numero_plazas,
          color: data.color,
          disponible: data.disponible
        });
        setMarca(data.marca_details.nombre)
        setModelo(data.modelo_details.nombre)
        //console.log(vehiculo)

        if (data.latitud && data.longitud) {
          await obtenerUbicacion(data.latitud, data.longitud);
        } else {
          console.log('El vehículo no tiene coordenadas de ubicación válidas.');
        }
      } catch (error) {
        console.error("Error fetching vehicle", error);
      }
    };
    fetchVehicle();
  }, []);
  //}, [id]);

  useEffect(() => {
    async function loadData() {
      const list_marcas = await getAllMarcas()
      const list_modelos = await getAllModelos()
      const choices = await getVehicleChoices()
      console.log('Lista de las marcas')
      console.log(list_marcas)
      // const sortedMarcas = sortMarcas(list_marcas.data, vehiculo.marca_id);
      // console.log(vehiculo.marca_id)
      // console.log(sortedMarcas)
      setListMarcas(list_marcas.data);

      //setListMarcas(list_marcas.data)
      setListModelos(list_modelos.data)

      setTipoCarroceriaChoices(choices.data.tipo_carroceria)
      setTipoCambioChoices(choices.data.tipo_cambio)
      setTipoCombustibleChoices(choices.data.tipo_combustible)

    }
    loadData()
  }, [])

  // const sortMarcas = (marcas, marcaActual) => {
  //   return marcas.sort((a, b) => {
  //     if (a.id === marcaActual) return -1;
  //     if (b.id === marcaActual) return 1;
  //     return 0;
  //   });
  // };


  async function loadModelos(id_marca) {
    const list_modelos = await getModelosMarca(id_marca)
    setListModelos(list_modelos.data)
  }

  // useEffect(() => {
  //   if (listMarcas.length > 0) {
  //     loadModelos(listMarcas[0].id)
  //     const marcaId = listMarcas[0].id;
  //     console.log(listMarcas[0].id)
  //     console.log(marcaId)
  //   }
  // }, [listMarcas]);


  const handleChange = (e) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeMarca = (e) => {
    loadModelos(e.target.value)

    setVehiculo({
      ...vehiculo,
      [e.target.name]: Number(e.target.value),
      modelo: listModelos[0].id
    })
  }

  const handleChangeModelo = (e) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: Number(e.target.value),
    })
  }

  const handleSelect = address => {
    setAddress(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log(latLng)
        setVehiculo({
          ...vehiculo,
          latitud: latLng.lat,
          longitud: latLng.lng,
        })
      })
      .catch(error => console.error('Error', error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar los datos actualizados del vehículo al backend
      await api.put(`/api/vehicles/${vehiculo.id}/`, vehiculo);
      const successMessage = `${marca} ${modelo} editado con éxito.`
      navigate(`/my-vehicles/${vehiculo.propietario_id}`, { state: { successMessage } })
      // Redirigir o mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error updating vehicle", error);
      // Mostrar un mensaje de error al usuario
    }
  }


  return (
    <div className="login-body">
      {vehiculo && Object.keys(vehiculo).length > 0 && ( // Comprobamos si vehiculo no está vacío
        <h1 className='text-center pt-2 edit-vehicle-h1'>Editar {marca} {modelo}</h1>
      )}

      <form onSubmit={handleSubmit} className="container mt-2 bg-white p-4 edit-vehicle-form">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="marca" className="form-label">Marca:</label><br />
              <select name='marca_id' value={vehiculo.marca_id} onChange={handleChangeMarca}>
                {listMarcas.map(marca => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="modelo" className="form-label">Modelo:</label><br />
              <select name='marca_id' value={vehiculo.modelo_id} onChange={handleChange}>
                {listModelos.map(modelo => (
                  <option key={modelo.id} value={modelo.id}>
                    {modelo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="año" className="form-label">Año:</label>
              <input type="number" className="form-control w-50" id="año" name="año" min={1950} max={2024} defaultValue={vehiculo.año} onChange={handleChange} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="matricula" className="form-label">Matrícula:</label>
              <input type="text" className="form-control w-50" id="matricula" name="matricula" defaultValue={vehiculo.matricula} onChange={handleChange} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="tipo_combustible" className="form-label">Tipo de Combustible:</label><br />
              <select name='tipo_combustible' value={vehiculo.tipo_combustible} onChange={handleChange}>
                {tipoCombustibleChoices.map((combus, index) => (
                  <option key={index} value={combus[0]}>
                    {combus[1]}
                  </option>
                ))}
              </select>
            </div>


            <div className="form-group mb-3">
              <label htmlFor="kilometraje" className="form-label">Kilometraje:</label>
              <input type="number" step="0.01" className="form-control w-50" id="kilometraje" name="kilometraje" defaultValue={vehiculo.kilometraje} onChange={handleChange} />
            </div>
          </div>


          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="precio_por_hora" className="form-label">Precio por Hora:</label>
              <input type="text" className="form-control w-50" id="precio_por_hora" name="precio_por_hora" defaultValue={vehiculo.precio_por_hora} onChange={handleChange} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción:</label>
              <textarea className="form-control w-75" id="descripcion" name="descripcion" rows="3" defaultValue={vehiculo.descripcion} onChange={handleChange}></textarea>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="tipo_carroceria" className="form-label">Tipo de Carrocería:</label><br />
              <select name='tipo_carroceria' value={vehiculo.tipo_carroceria} onChange={handleChange}>
                {tipoCarroceriaChoices.map((carro, index) => (
                  <option key={index} value={carro[0]}>
                    {carro[1]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group  mb-3">
              <label htmlFor="consumo" className="form-label">Consumo:</label>
              <input type="text" className="form-control w-50" id="consumo" name="consumo" defaultValue={vehiculo.consumo} onChange={handleChange} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label><br />
              <select name='tipo_cambio' value={vehiculo.tipo_cambio} onChange={handleChange}>
                {tipoCambioChoices.map((cambio, index) => (
                  <option key={index} value={cambio[0]}>
                    {cambio[1]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mb-4">
              <label htmlFor="autonomia" className="form-label">Autonomía:</label>
              <input type="number" step="0.01" className="form-control w-50" id="autonomia" name="autonomia" defaultValue={vehiculo.autonomia} onChange={handleChange}
                min={0} max={999} />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="numero_plazas" className="form-label">Número de Plazas:</label>
              <input type="number" className="form-control w-50" id="numero_plazas" name="numero_plazas" defaultValue={vehiculo.numero_plazas} onChange={handleChange}
                min="1" max="9" />
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Ubicación de tu vehículo</label>
              <p>ACTUAL: {ubicacion}</p>
              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div className="form-inline d-flex">
                    <div className="flex-grow-1 position-relative">
                      <input className='form-control' {...getInputProps({ placeholder: 'Buscar ubicaciones ...' })} />

                      <div className='suggestions-container'>
                        {loading && <div className="loading">Cargando...</div>}
                        {suggestions.map((suggestion, index) => {
                          const className = suggestion.active ? 'suggestion-item active' : 'suggestion-item';
                          return (
                            <div key={index} className={className} onClick={() => getSuggestionItemProps(suggestion)}>
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </PlacesAutocomplete>
            </div>

          </div>
        </div>

        <div className="text-center d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary mx-3">Guardar cambios</button>
          <Link to={`/my-vehicles/${user.id}`} className="btn btn-secondary mx-3">Cancelar</Link>
          <Link to={`/edit-vehicle/images/${vehiculo.id}`} className="btn btn-secondary mx-3">Editar las imágenes</Link>
        </div>

      </form>

    </div>
  )
}
