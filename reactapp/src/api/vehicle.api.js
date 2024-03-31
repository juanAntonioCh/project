import axios from 'axios'

const conectaCarApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/ConectaCar/vehicles/ConectaCar/'
    //baseURL: 'http://127.0.0.1:8000/api/vehicles/'
})

export const getAllVehicles = () => {
    return conectaCarApi.get('/')
}

export const createVehicle = (vehi) => {
    return conectaCarApi.post('/', vehi)
}

// export const getAllVehicles = () =>{
//     return axios.get('http://127.0.0.1:8000/ConectaCar/vehicles/ConectaCar/')
// }