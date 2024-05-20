import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from 'axios'

export const copia = () => {

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