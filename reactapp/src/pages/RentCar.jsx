import React, { useEffect, useState } from 'react'
import '../styles/rent-car.css'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { createVehicle, getAllMarcas, getAllModelos, getModelosMarca, getVehicleChoices } from '../api/vehicle.api'
import axios from 'axios'

export const RentCar = () => {
  const [marcas, setMarcas] = useState([]);
  const [tipoCarroceriaChoices, setTipoCarroceriaChoices] = useState([])
  const [tipoCambioChoices, setTipoCambioChoices] = useState([])
  const [tipoCombustibleChoices, setTipoCombustibleChoices] = useState([])
  const [modelos, setModelos] = useState([]);
  const [marcaActual, setMarcaActual] = useState('')
  const [address, setAddress] = useState('');
  const [userName, setUserName] = useState('');
  const [vehiculo, setVehiculo] = useState({
    propietario: '',
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
    is_available: true
  })

  //Obtetener las marcas y modelos de vehículos. Y los campos choices
  useEffect(() => {
    async function loadData() {
      const list_marcas = await getAllMarcas()
      const list_modelos = await getAllModelos()
      const choices = await getVehicleChoices()

      setMarcas(list_marcas.data)
      setModelos(list_modelos.data)

      setTipoCarroceriaChoices(choices.data.tipo_carroceria)
      setTipoCambioChoices(choices.data.tipo_cambio)
      setTipoCombustibleChoices(choices.data.tipo_combustible)

    }
    loadData()
  }, [])

  //actualizar el objeto vehiculo con la primera marca y modelo de la lista
  useEffect(() => {
    if (marcas.length > 0 && modelos.length > 0) {
      setVehiculo({
        ...vehiculo,
        marca: marcas[0].nombre,
        modelo: modelos[0].nombre,
        tipo_carroceria: tipoCarroceriaChoices[0][1],
        tipo_cambio: tipoCambioChoices[0][1],
        tipo_combustible: tipoCombustibleChoices[0][1]
      })
      //console.log(marcas[0].nombre)
      //console.log(modelos[0].nombre)
    }
  }, [marcas, modelos]);


  //actualizar el objeto vehiculo cuando haya algun cambio 
  const handleChange = (e) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeMarca = (e) => {
    async function loadModelos() {
      //obtener todos los modelos de la marca seleccionada y actualizar la lista en la página
      const list_modelos = await getModelosMarca(e.target.value)
      setModelos(list_modelos.data)

      //cada vez que cambie la marca actyalizamos el modelo al primero que aparece en el select
      setVehiculo({
        ...vehiculo,
        [e.target.name]: e.target.options[e.target.selectedIndex].dataset.nombre,
        modelo: list_modelos.data[0].nombre
      })
    }
    loadModelos()
  }

  useEffect(() => {
    console.log(vehiculo)
  }, [vehiculo])


  async function handleSubmit(e) {
    e.preventDefault()
    console.log(vehiculo)
    const res = await createVehicle(vehiculo)
    console.log(res)
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/user-details', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setUserName(response.data.username); 

      } catch (error) {
        console.error('Error al obtener los detalles del usuario', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(()=>{
    setVehiculo({
      ...vehiculo,
      propietario: userName
    })
    console.log(userName)

  }, [userName])


  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row">
        {/* Columna 1 */}
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="marca" className="form-label">Marca:</label><br />
            <select name='marca' onChange={handleChangeMarca}>
              {marcas.map(marca => (
                <option key={marca.id} value={marca.id} data-nombre={marca.nombre}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="modelo" className="form-label">Modelo:</label><br />
            <select name='modelo' onChange={handleChange}>
              {modelos.map(modelo => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="año" className="form-label">Año:</label>
            <input type="number" className="form-control" id="año" name="año" value={vehiculo.año} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="matricula" className="form-label">Matrícula:</label>
            <input type="text" className="form-control" id="matricula" name="matricula" value={vehiculo.matricula} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="tipo_combustible" className="form-label">Tipo de Combustible:</label><br />
            <select name='tipo_combustible' onChange={handleChange}>
              {tipoCombustibleChoices.map(combus => (
                <option value={combus[1]}>
                  {combus[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="kilometraje" className="form-label">Kilometraje:</label>
            <input type="text" className="form-control" id="kilometraje" name="kilometraje" value={vehiculo.kilometraje} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="precio_por_hora" className="form-label">Precio por Hora:</label>
            <input type="text" className="form-control" id="precio_por_hora" name="precio_por_hora" value={vehiculo.precio_por_hora} onChange={handleChange} />
          </div>

        </div>

        {/* Columna 2 */}
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción:</label>
            <textarea className="form-control" id="description" name="description" rows="3" value={vehiculo.description} onChange={handleChange}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="tipo_carroceria" className="form-label">Tipo de Carrocería:</label><br />
            <select name='tipo_carroceria' onChange={handleChange}>
              {tipoCarroceriaChoices.map(carro => (
                <option value={carro[1]}>
                  {carro[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="consumo" className="form-label">Consumo:</label>
            <input type="text" className="form-control" id="consumo" name="consumo" value={vehiculo.consumo} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label><br />
            <select name='tipo_cambio' onChange={handleChange}>
              {tipoCambioChoices.map(cambio => (
                <option value={cambio[1]}>
                  {cambio[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Ubicación de tu vehículo</label>
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

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="is_available" name="is_available" checked={vehiculo.is_available} onChange={handleChange} />
            <label className="form-check-label" htmlFor="is_available">Disponible</label>
          </div>

        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-primary">Publicar Vehículo</button>
      </div>
    </form>
  )
}
