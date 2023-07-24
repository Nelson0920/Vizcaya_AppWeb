import axios from 'axios'

const connectionApiProducts = axios.create({
    baseURL: 'http://127.0.0.1:3000/register/api/v1/clients/',
})

export const sendDataClient = async (data) => {
    try {
        const response = await connectionApiProducts.post('/', data)
        return response.data
    } catch (error) {
        throw error
    }
}