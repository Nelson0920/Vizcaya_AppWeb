import axios from 'axios'

const coneccionApiChatbot = axios.create({
    baseURL: 'http://127.0.0.1:3000/register/api/v1/',
})


export const ChatBotMessage = async (user_input) => {
    try {
        const response = await coneccionApiChatbot.post('/chatbot/', { user_input });
        return response.data;
    } catch (error) {
        throw error;
    }
};