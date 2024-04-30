import axios from 'axios'

const conectaCarApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/vehicles/'
    //baseURL: 'http://127.0.0.1:8000/api/vehicles/'
})

export const getAllVehicles = () => {
    return conectaCarApi.get('/')
}

// export const createVehicle = (vehi) => {
//     return conectaCarApi.post('/', vehi)
// }

export const getAllMarcas = () => {
    return axios.get('http://127.0.0.1:8000/api/marca')
}

export const getAllModelos = () => {
    return axios.get('http://127.0.0.1:8000/api/modelo')
}

export const getModelosMarca = (marcaId) => {
    return axios.get(`http://127.0.0.1:8000/api/modelos/${marcaId}/`);
}

export const getVehicleChoices = () => {
    return axios.get('http://127.0.0.1:8000/api/vehicle-choices');
}

export const UserDetails = () => {
    return axios.get('http://127.0.0.1:8000/api/user-details');
}