import axios from 'axios'

const coneccionApiRegister = axios.create({
    baseURL: 'http://127.0.0.1:3000/register/api/v1/users/',
})
const coneccionApiLogin = axios.create({
    baseURL: 'http://127.0.0.1:3000/register/api/v1/login/',
})

export const getAllRegister = () => coneccionApiRegister.get('/users-list/')

export const createRegister = async (data) => {
    try {
        const response = await coneccionApiRegister.post('/', data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateRegister = async (userId, data) => {
    try {
        const response = await coneccionApiRegister.put(`/${userId}/update/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (data) => {
    try {
        const response = await coneccionApiLogin.post('/', data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('An error occurred. Please try again later.');
        }
    }
};


