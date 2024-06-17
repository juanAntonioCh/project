import React, { useEffect, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useNavigate, Link } from 'react-router-dom';
import { api, getAllMarcas, getAllModelos, getModelosMarca, getVehicleChoices } from '../api/vehicle.api'
import '../styles/CrearVehiculoPage.css'
import { useContext } from "react"
import { AuthContext } from '../context/AuthContext';
import { LogoSvg } from '../components/LogoSvg';

export const RentCar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listMarcas, setListMarcas] = useState([]);
  const [listModelos, setListModelos] = useState([]);
  const [tipoCarroceriaChoices, setTipoCarroceriaChoices] = useState([])
  const [tipoCambioChoices, setTipoCambioChoices] = useState([])
  const [tipoCombustibleChoices, setTipoCombustibleChoices] = useState([])
  const [imagenes, setImagenes] = useState([])
  const [address, setAddress] = useState('');
  const [pagination, setPagination] = useState(0)
  const [error, setError] = useState('')
  const [noLogin, setNoLogin] = useState('')
  const [vehiculo, setVehiculo] = useState({
    propietario_id: '', marca_id: 1, modelo_id: 0, año: 2010, matricula: '', descripcion: '', tipo_carroceria: '',
    tipo_combustible: '', consumo: '', kilometraje: '', tipo_cambio: '', precio_por_hora: '', latitud: '', longitud: '', color: 'verde',
    autonomia: '', numero_plazas: 5, disponible: true
  })

  const searchOptions = {
    types: ['(regions)'],
    componentRestrictions: { country: 'es' }
  };

  //ver los cambios en el vehiculo
  useEffect(() => {
    //console.log(vehiculo)
  }, [vehiculo])


  useEffect(() => {
    setVehiculo({
      ...vehiculo,
      propietario_id: user.id
    })
  }, [user])

  useEffect(() => {
    // Obtener todos los formularios para aplicarle las clases de Bootstrap
    const forms = document.querySelectorAll('.needs-validation');
    //console.log('los formus son: ', forms);

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      }, false);
    });
  }, []);


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


  //actualizar el objeto vehiculo con la primera marca y modelo de la lista
  useEffect(() => {
    if (listMarcas.length > 0) {
      loadModelos(listMarcas[0].id)
      const marcaId = listMarcas[0].id;

      setVehiculo({
        ...vehiculo,
        marca_id: marcaId,
      })
    }
  }, [listMarcas]);
  //}, [marcas, modelos]);

  useEffect(() => {
    if (listMarcas.length > 0 && listModelos.length > 0) {
      //console.log(listModelos[0].nombre)
      setVehiculo({
        ...vehiculo,
        modelo_id: listModelos[0].id,
        tipo_carroceria: tipoCarroceriaChoices[0][0],
        tipo_cambio: tipoCambioChoices[0][0],
        tipo_combustible: tipoCombustibleChoices[0][0]
      })
    }
  }, [listModelos])

  const validarVehiculo = () => {
    for (let key in vehiculo) {
      if (vehiculo[key] === '' && key !== 'descripcion') {
        return false;
      }
    }
    return true;
  };


  async function handleSubmit(e) {
    e.preventDefault()
    //console.log(vehiculo)

    // if (vehiculo.propietario_id === '') {
    //   setNoLogin('Inicia sesión para publicar tu vehículo ')
    //   return
    // }

    if (!validarVehiculo()) {
      //setError('Porfavor, comprueba que todos los campos del formulario estén completos')
      setError('Es necesario que introduzcas la ubicación en la que se encuentra el vehículo')
      return
    }

    const formData = new FormData();
    //console.log(imagenes)
    imagenes.forEach((imagen) => {
      formData.append('imagen', imagen);
    });
    formData.append('vehiculo', JSON.stringify(vehiculo))
    //console.log(formData)

    try {
      const response = await api.post('/api/create-vehicle/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      //console.log(response.data);
      const successMessage = `Vehículo publicado con éxito`
      navigate('/home', { state: { successMessage } })
    } catch (error) {
      //console.error('Error al enviar el formulario:', error.response.data.error);
      setError(error.response.data.error)
    }
  }

  const handleImagenesChange = (e) => {
    setImagenes(Array.from(e.target.files))
  }

  const handleCloseAlert = () => {
    setError(null);
    setNoLogin(null)
  };

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

  const renderPageContent = () => {
    switch (pagination) {
      case 0:
        return (
          <div className='row'>
            <div className='col-6'>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="marca_id" className="form-label">Marca:</label><br />
                <select name='marca_id' onChange={handleChangeMarca}>
                  {listMarcas.map(marca => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="modelo_id" className="form-label">Modelo:</label><br />
                <select name='modelo_id' onChange={handleChangeModelo}>
                  {listModelos.map(modelo => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="año" className="form-label">Año:</label>
                <input type="number" className="form-control w-75" id="año" name="año" min={1950} max={2024} value={vehiculo.año} onChange={handleChange} />
                <small className="form-text text-muted">Introduce el año de fabricación del vehículo.</small>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="autonomia" className="form-label">Autonomía:</label>
                <input type="number" step="0.01" className="form-control" id="autonomia" name="autonomia" value={vehiculo.autonomia} onChange={handleChange}
                  min={0} max={999} />
                <small className="form-text text-muted">Introduce la autonomía estimada del vehículo en kilómetros con un tanque de combustible lleno.</small>
              </div>
            </div>
            <div className='col-6'>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="consumo" className="form-label">Consumo:</label>
                <input type="number" step="0.01" className="form-control" id="consumo" name="consumo" value={vehiculo.consumo} onChange={handleChange} />
                <small className="form-text text-muted">Introduce el consumo del vehículo en litros o kWh (dependiendo del tipo de combustible) por cada 100 km.</small>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="matricula" className="form-label">Matrícula:</label>
                <input type="text" className="form-control" id="matricula" name="matricula" value={vehiculo.matricula} onChange={handleChange} />
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="kilometraje" className="form-label">Kilometraje:</label>
                <input type="number" step="0.01" className="form-control" id="kilometraje" name="kilometraje" min={0} value={vehiculo.kilometraje} onChange={handleChange} />
                <small className="form-text text-muted">Introduce cuantos kilómetros lleva recorridos el vehículo actualmente.</small>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className='row'>
            <div className='col-6'>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="tipo_combustible" className="form-label">Tipo de Combustible:</label><br />
                <select name='tipo_combustible' onChange={handleChange}>
                  {tipoCombustibleChoices.map((combus, index) => (
                    <option key={index} value={combus[0]}>
                      {combus[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="tipo_carroceria" className="form-label">Tipo de Carrocería:</label><br />
                <select name='tipo_carroceria' onChange={handleChange}>
                  {tipoCarroceriaChoices.map((carro, index) => (
                    <option key={index} value={carro[0]}>
                      {carro[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label><br />
                <select name='tipo_cambio' onChange={handleChange}>
                  {tipoCambioChoices.map((cambio, index) => (
                    <option key={index} value={cambio[0]}>
                      {cambio[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="numero_plazas" className="form-label">Número de Plazas:</label>
                <input type="number" className="form-control" id="numero_plazas" name="numero_plazas" value={vehiculo.numero_plazas} onChange={handleChange}
                  min={1} max={9} />
                <small className="form-text text-muted">Introduce el número de plazas disponibles en el vehículo (máximo 9).</small>
              </div>
            </div>
            <div className='col-6'>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="precio_por_hora" className="form-label">Precio por hora:</label>
                <input type="number" step="0.01" className="form-control" id="precio_por_hora" name="precio_por_hora" value={vehiculo.precio_por_hora} onChange={handleChange} />
                <small className="form-text text-muted">La media de precio por hora de los coches en nuestra aplicación se ubica entre 1.5 y 3.3 €.</small>
              </div>
              <div className="form-group mb-4 position-relative">
                <label htmlFor="descripcion" className="form-label">Descripción:</label>
                <textarea className="form-control" id="descripcion" name="descripcion" rows="4" value={vehiculo.descripcion} onChange={handleChange}></textarea>
                <small className="form-text text-muted">Introduce una breve descripción del vehículo (opcional).</small>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='row d-flex align-content-center flex-column g-5'>
            <div className='col-6'>
              {/* Agrega los campos adicionales para la página 3 aquí */}
              <div className="form-group mb-4 position-relative">
                <label className="form-label">Ubicación de tu vehículo</label>
                <PlacesAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={handleSelect}
                // searchOptions={searchOptions}
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
              <div className="form-group mb-4 position-relative">

              </div>
            </div>
            <div className='col-6'>
              <div className="form-group mb-4 position-relative">
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="rent-car-body">
      {noLogin && (
        <div className="alert-container">
          <div className="alert alert-warning alert-dismissible fade show " role="alert">
            <strong><Link to='/login'>Inicia sesión</Link> para continuar con el proceso de publicar tu vehículo.</strong>
            <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
          </div>
        </div>
      )}
      {error && (
        <div className="alert-container">
          <div className="alert alert-danger alert-dismissible fade show " role="alert">
            <strong>{error}</strong>
            <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
          </div>
        </div>
      )}

      <div className='container rent-car-container'>
        <div className="row pt-1">

          <div className="col-12 col-lg-7 bg-white">

            <form className="form-container needs-validation p-4" noValidate>

              <div className="text-end">
                <LogoSvg width={'80px'} height={'80px'} />
              </div>
              <h1 className="mb-5 pt-3 text-center fs-3 fw-bold">Gana dinero compartiendo tu coche</h1>

              {renderPageContent()}

            </form>

            <div className="d-flex justify-content-between">
              {pagination > 0 && (
                <button className="btn btn-primary w-25 mb-3" onClick={(e) => {
                  e.preventDefault();
                  setPagination(pagination - 1);
                }}>Anterior</button>
              )}
              {pagination === 0 && (
                <button className="btn btn-primary w-25 mb-3" onClick={(e) => {
                  e.preventDefault();
                  const matriculaRegex = /^\d{4}[A-Z]{3}$/;
                  if (!vehiculo.propietario_id) {
                    setNoLogin('Inicia sesión para publicar tu vehículo ')
                  } else if (vehiculo.autonomia === '' || vehiculo.consumo === '' || vehiculo.matricula === '' || vehiculo.kilometraje === '' || vehiculo.año === '') {
                    setError('Porfavor, comprueba que todos los campos del formulario estén completos antes de avanzar de página')
                    //return
                  } else if (vehiculo.año < 1950 || vehiculo.año > 2024) {
                    setError('El año de fabricación del vehículo no puede ser inferior a 1950 ni superior a 2024')
                  } else if (!matriculaRegex.test(vehiculo.matricula)){
                    setError('Matrícula no válida. Debe seguir el formato 0000XXX.')
                  } else {
                    setPagination(pagination + 1);
                  }

                }}>Siguiente</button>
              )}
              {pagination === 1 && (
                <button className="btn btn-primary w-25 mb-3" onClick={(e) => {
                  e.preventDefault();
                  if (vehiculo.numero_plazas === '' || vehiculo.precio_por_hora === '') {
                    setError('Número de plazas y precio por hora son campos obligatorios')
                  } else if (vehiculo.numero_plazas <= 0 || vehiculo.numero_plazas > 9){   
                    setError('El número de plazas no puede ser menor a 1 ni superior a 9')  
                  } else if (vehiculo.precio_por_hora < 0.1 || vehiculo.precio_por_hora > 10){   
                    setError('El precio por hora no puede ser inferior a 0.1 ni superior a 10')                                
                  } else {
                    setPagination(pagination + 1);
                  }
                }}>Siguiente</button>
              )}
              {pagination === 2 && (
                <button className="btn btn-primary w-25 mb-3" onClick={handleSubmit}>Publicar Vehículo</button>
              )}
            </div>


          </div>

          <div className="col-lg-5 d-none d-lg-block rent-car-image"></div>

        </div>
      </div>
    </div>
  )
}
