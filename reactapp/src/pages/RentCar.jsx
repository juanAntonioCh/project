import React, { useEffect, useState } from 'react'
// import '../styles/rent-car.css'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useNavigate } from 'react-router-dom';
import { getAllMarcas, getAllModelos, getModelosMarca, getVehicleChoices } from '../api/vehicle.api'
import axios from 'axios'
import { useContext } from "react"
import { AuthContext } from '../context/AuthContext';

export const RentCar = () => {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [listMarcas, setListMarcas] = useState([]);
  const [listModelos, setListModelos] = useState([]);
  const [tipoCarroceriaChoices, setTipoCarroceriaChoices] = useState([])
  const [tipoCambioChoices, setTipoCambioChoices] = useState([])
  const [tipoCombustibleChoices, setTipoCombustibleChoices] = useState([])
  const [imagenes, setImagenes] = useState([])
  const [address, setAddress] = useState('');
  //const [propietario, setPropietario] = useState({});
  const [vehiculo, setVehiculo] = useState({
    propietario_id: '',
    marca_id: 1,
    modelo_id: 0,
    año: 0,
    matricula: '',
    descripcion: '',
    tipo_carroceria: '',
    tipo_combustible: '',
    consumo: '',
    kilometraje: '',
    tipo_cambio: '',
    precio_por_hora: '',
    latitud: '',
    longitud: '',
    color: 'verde',
    disponible: true
  })

  //ver los cambios en el vehiculo
  useEffect(() => {
    console.log(vehiculo)
  }, [vehiculo])


  useEffect(() => {
    setVehiculo({
      ...vehiculo,
      propietario_id: user
    })
  }, [user])

  //Obtetener las marcas y modelos de vehículos. Y los campos choices
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


  //función para OBTENER TODOS LOS MODELOS de la MARCA seleccionada y actualizar el array de modelos
  async function loadModelos(id_marca) {
    const list_modelos = await getModelosMarca(id_marca)
    setListModelos(list_modelos.data)
  }


  //actualizar el objeto vehiculo con la primera marca y modelo de la lista
  useEffect(() => {
    console.log('*********************************')
    console.log(listMarcas)
    console.log(listModelos)
    if (listMarcas.length > 0) {

      loadModelos(listMarcas[0].id)
      const marcaId = listMarcas[0].id;
      console.log(listMarcas[0].id)
      console.log(marcaId)

      setVehiculo({
        ...vehiculo,
        marca_id: marcaId,
      })
    }
  }, [listMarcas]);
  //}, [marcas, modelos]);

  useEffect(() => {
    if (listMarcas.length > 0 && listModelos.length > 0) {
      console.log(listModelos[0].nombre)
      setVehiculo({
        ...vehiculo,
        modelo_id: listModelos[0].id,
        tipo_carroceria: tipoCarroceriaChoices[0][0],
        tipo_cambio: tipoCambioChoices[0][0],
        tipo_combustible: tipoCombustibleChoices[0][0]
      })
    }
  }, [listModelos])


  //actualizar el objeto vehiculo cuando haya algun cambio 
  const handleChange = (e) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value
    })
  }

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

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(vehiculo)

    const formData = new FormData();
    console.log(imagenes)
    imagenes.forEach((imagen) => {
      formData.append('imagen', imagen);
    });
    formData.append('vehiculo', JSON.stringify(vehiculo))
    console.log(formData)

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create-vehicle/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      navigate('/')
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response);
    }
  }


  const handleImagenesChange = (e) => {
    setImagenes(Array.from(e.target.files))
  }

  useEffect(() => {
    console.log(imagenes)
  }, [imagenes])


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

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row">
        {/* Columna 1 */}
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="marca_id" className="form-label">Marca:</label><br />
            <select name='marca_id' onChange={handleChangeMarca}>
              {listMarcas.map(marca => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="modelo_id" className="form-label">Modelo:</label><br />
            <select name='modelo_id' onChange={handleChangeModelo}>
              {listModelos.map(modelo => (
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
              {tipoCombustibleChoices.map((combus, index) => (
                <option key={index} value={combus[0]}>
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
            <label htmlFor="descripcion" className="form-label">Descripción:</label>
            <textarea className="form-control" id="descripcion" name="descripcion" rows="3" value={vehiculo.descripcion} onChange={handleChange}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="tipo_carroceria" className="form-label">Tipo de Carrocería:</label><br />
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
            <input type="text" className="form-control" id="consumo" name="consumo" value={vehiculo.consumo} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label><br />
            <select name='tipo_cambio' onChange={handleChange}>
              {tipoCambioChoices.map((cambio, index) => (
                <option key={index} value={cambio[0]}>
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

          <div className="mb-3">
            <label className="form-label">Imagenes de su vehiculo</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagenesChange}
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-primary">Publicar Vehículo</button>
      </div>
    </form>
  )
}
