import React, { useEffect, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useNavigate } from 'react-router-dom';
import { getAllMarcas, getAllModelos, getModelosMarca, getVehicleChoices } from '../api/vehicle.api'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'

export const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listMarcas, setListMarcas] = useState([]);
  const [listModelos, setListModelos] = useState([]);
  const [tipoCarroceriaChoices, setTipoCarroceriaChoices] = useState([])
  const [tipoCambioChoices, setTipoCambioChoices] = useState([])
  const [tipoCombustibleChoices, setTipoCombustibleChoices] = useState([])
  const [imagenes, setImagenes] = useState([])
  const [address, setAddress] = useState('');
  const [ubicacion, setUbicacion] = useState('')
  const [marca, setMarca] =  useState('')
  const [modelo, setModelo] =  useState('')
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
        const { data } = await axios.get(`http://localhost:8000/api/vehicles/${id}`);
        //console.log(data)
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
          color: data.color,
          disponible: data.disponible
        });
        setMarca(data.marca_details.nombre)
        setModelo(data.modelo_details.nombre)
        console.log(vehiculo)

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

      setListMarcas(list_marcas.data)
      setListModelos(list_modelos.data)

      setTipoCarroceriaChoices(choices.data.tipo_carroceria)
      setTipoCambioChoices(choices.data.tipo_cambio)
      setTipoCombustibleChoices(choices.data.tipo_combustible)

    }
    loadData()
  }, [])


  async function loadModelos(id_marca) {
    const list_modelos = await getModelosMarca(id_marca)
    setListModelos(list_modelos.data)
  }

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
      await axios.put(`http://127.0.0.1:8000/api/vehicles/${vehiculo.id}/`, vehiculo);
      navigate(`/my-vehicles/${vehiculo.propietario_id}`)
      // Redirigir o mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error updating vehicle", error);
      // Mostrar un mensaje de error al usuario
    }
  }


  return (
    <>
      {vehiculo && Object.keys(vehiculo).length > 0 && ( // Comprobamos si vehiculo no está vacío
        <h1>Editar {marca} {modelo}</h1>
      )}

      <form onSubmit={handleSubmit} className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="marca" className="form-label">Marca:</label><br />
              <select name='marca' onChange={handleChangeMarca}>
                {listMarcas.map(marca => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="modelo" className="form-label">Modelo:</label><br />
              <select name='modelo' onChange={handleChangeModelo}>
                {listModelos.map(modelo => (
                  <option key={modelo.id} value={modelo.id}>
                    {modelo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="año" className="form-label">Año:</label>
              <input type="number" className="form-control" id="año" name="año" defaultValue={vehiculo.año} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="matricula" className="form-label">Matrícula:</label>
              <input type="text" className="form-control" id="matricula" name="matricula" defaultValue={vehiculo.matricula} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="tipo_combustible" className="form-label">Tipo de Combustible:</label><br />
              <p>ACTUAL: {vehiculo.tipo_combustible}</p>
              <select name='tipo_combustible' onChange={handleChange}>
                {tipoCombustibleChoices.map((combus, index) => (
                  <option key={index} value={combus[0]}>
                    {combus[1]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="kilometraje" className="form-label">Kilometraje:</label>
              <input type="text" className="form-control" id="kilometraje" name="kilometraje" defaultValue={vehiculo.kilometraje} onChange={handleChange} />
            </div>
          </div>


          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="precio_por_hora" className="form-label">Precio por Hora:</label>
              <input type="text" className="form-control" id="precio_por_hora" name="precio_por_hora" defaultValue={vehiculo.precio_por_hora} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción:</label>
              <textarea className="form-control" id="descripcion" name="descripcion" rows="3" defaultValue={vehiculo.descripcion} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="tipo_carroceria" className="form-label">Tipo de Carrocería:</label><br />
              <p>ACTUAL: {vehiculo.tipo_carroceria}</p>
              <select name='tipo_carroceria' onChange={handleChange}>
                {tipoCarroceriaChoices.map((carro, index) => (
                  <option key={index} value={carro[0]}>
                    {carro[1]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="consumo" className="form-label">Consumo:</label>
              <input type="text" className="form-control" id="consumo" name="consumo" defaultValue={vehiculo.consumo} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label><br />
              <p>ACTUAL: {vehiculo.tipo_cambio}</p>
              <select name='tipo_cambio' onChange={handleChange}>
                {tipoCambioChoices.map((cambio, index) => (
                  <option key={index} value={cambio[0]}>
                    {cambio[1]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-4">
            <div className="mb-5">
              <label className="form-label">Ubicación de tu vehículo</label>
              <p>ACTUAL: {ubicacion}</p>
              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div>
                    <input {...getInputProps({ placeholder: 'Buscar ubicaciones ...' })} />
                    <div>
                      {loading && <div>Cargando...</div>}
                      {suggestions.map(suggestion => {
                        return (
                          <div key={suggestion.index} {...getSuggestionItemProps(suggestion)}>
                            <span>{suggestion.description}</span>
                            {/* {console.log(suggestion)} */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>

            <Link to={`/edit-vehicle/images/${vehiculo.id}`} className="btn btn-secondary m-5">Editar las imágenes</Link>

          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </div>
      </form>

    </>
  )
}
