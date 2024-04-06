import React, { useEffect, useState } from 'react'
import '../styles/rent-car.css'
import { createVehicle, getAllMarcas, getAllModelos, getModelosMarca } from '../api/vehicle.api'

export const RentCar = () => {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [marcaActual, setMarcaActual] = useState('')
  const [vehiculo, setVehiculo] = useState({
    //owner: null,
    marca: 'Volkswagen',
    modelo: 'Fiesta',
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
    is_available: false
  })

  //Obtetener las marcas y modelos de vehículos
  useEffect(() => {
    async function loadData() {
      const list_marcas = await getAllMarcas()
      const list_modelos = await getAllModelos()
      setMarcas(list_marcas.data)
      setModelos(list_modelos.data)
    }
    loadData()
  }, [])


  const handleChange = (e) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeMarca = (e) =>{
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

  useEffect(()=>{
    console.log(vehiculo)
  }, [vehiculo])


  async function handleSubmit(e) {
    e.preventDefault()
    console.log(vehiculo)
    const res = await createVehicle(vehiculo)
    console.log(res)
  }


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
            <label htmlFor="tipo_combustible" className="form-label">Tipo de Combustible:</label>
            <input type="text" className="form-control" id="tipo_combustible" name="tipo_combustible" value={vehiculo.tipo_combustible} onChange={handleChange} />
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
            <label htmlFor="tipo_carroceria" className="form-label">Tipo de Carrocería:</label>
            <input type="text" className="form-control" id="tipo_carroceria" name="tipo_carroceria" value={vehiculo.tipo_carroceria} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="consumo" className="form-label">Consumo:</label>
            <input type="text" className="form-control" id="consumo" name="consumo" value={vehiculo.consumo} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label>
            <input type="text" className="form-control" id="tipo_cambio" name="tipo_cambio" value={vehiculo.tipo_cambio} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="latitud" className="form-label">Latitud:</label>
            <input type="text" className="form-control" id="latitud" name="latitud" value={vehiculo.latitud} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="longitud" className="form-label">Longitud:</label>
            <input type="text" className="form-control" id="longitud" name="longitud" value={vehiculo.longitud} onChange={handleChange} />
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
