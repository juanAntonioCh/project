import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from 'axios'
import { useRent } from "../../hooks/UseRent";

export const Marca = () => {
    const { handleChange, vehiculo, setVehiculo, listMarcas, listModelos} = useRent()

    return (
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
                <input type="number" className="form-control w-75" id="año" name="año" value={vehiculo.año} onChange={handleChange} />
            </div>
        </div>

    )
}