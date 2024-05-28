import axios from 'axios'

const apiURL = '/choreo-apis/django-rest-api/mysite/v1'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiURL
})

export const getAllVehicles = () => {
    return api.get('/api/vehicles/')
}

export const getAllMarcas = () => {
    return api.get('/api/marca')
}

export const getAllModelos = () => {
    return api.get('/api/modelo')
}

export const getModelosMarca = (marcaId) => {
    return api.get(`/api/modelos/${marcaId}/`);
}

export const getVehicleChoices = () => {
    return api.get('/api/vehicle-choices');
}

export const UserDetails = () => {
    return api.get('/api/user-details');
}

export const getUserVehicles = (userId) => {
    return api.get(`/api/vehicles/user/${userId}/`);
}
