import axios from 'axios';

const connectionApiComments = axios.create({
    baseURL: 'http://127.0.0.1:3000/products/api/v2/products/', // Actualiza la URL base según la configuración de tu servidor backend
});

export const createComment = (productId, commentData, user) => {
    return connectionApiComments.post(`${productId}/create_comment/`, {
        "cont_com": commentData,
        "nom_com": user
    })
        .catch(error => {
            console.log('Error:', error);
            throw error;
        });
};

export const getCommentsByProductId = (productId) => {
    return connectionApiComments.get(`${productId}/comments/`)
        .then(response => response.data)
        .catch(error => {
            console.log('Error:', error);
            throw error;
        });
};
