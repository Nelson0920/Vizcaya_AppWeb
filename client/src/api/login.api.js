import axios from 'axios'

const coneccionApiLogin = axios.create({
    baseURL: 'http://127.0.0.1:3000/register/api/v1/registers/'
})

export const getAllRegister = () => coneccionApiRegister.get("/")

export const createRegister = (data) => coneccionApiRegister.post("/", data)
