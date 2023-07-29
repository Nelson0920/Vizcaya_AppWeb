import React, { useContext, useEffect, useState } from 'react';
import { createComment, getCommentsByProductId } from "../api/comment.api";
import { getProductStars, productStars, getProductsStarsSummary } from "../api/products.api";
import iconInfo from '@icons/bt_add_to_cart.svg';
import AppContext from '../context/AppContext';
import '@styles/ProductInfo.scss';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { AiOutlineSend } from 'react-icons/ai';

const cookies = new Cookies();

const ProductInfo = ({ product, onClose }) => {
  const { addToCart } = useContext(AppContext);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isMessageExceeded, setIsMessageExceeded] = useState(false);
  const [isMessageTooShort, setIsMessageTooShort] = useState(false);
  const [rating, setRating] = useState(0); // Estado para almacenar la valoración
  const [scaledStars, setScaledStars] = useState(0);

  const handleAddToCart = () => {
    addToCart({ ...product });
    toast.success(`${product.nam_prd} ha sido agregado al carrito`, {
      autoClose: 2000,
      theme: "colored",
      position: "bottom-left"
    });
  };
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return; // No enviar el mensaje si no hay nada escrito
    }

    setIsSendingMessage(true);

    try {
      // Validar caracteres especiales y longitud del mensaje
      const validMessage = newMessage.trim();

      if (validMessage.length < 10) {
        setIsMessageTooShort(true);
        setIsMessageExceeded(false);
      } else {
        setIsMessageTooShort(false);

        if (validMessage.length > 150) {
          setIsMessageExceeded(true);
        } else {
          setIsMessageExceeded(false);

          // Enviar la valoración junto con el comentario
          await createComment(product.id, validMessage, cookies.get('nam_reg'), rating);
          setNewMessage('');
          await fetchChatMessages();

          // Actualizar la valoración mostrada en el componente después de enviar el comentario
          const newRating = (await getProductStars(product.id)).data?.rank_prd || 0;
          setRating(newRating);

          // Guardar la valoración del usuario en el backend
          await productStars(cookies.get('id'), { "product": product.id, "rank_prd": rating });

          // Obtener el resumen de estrellas para el producto
          await fetchProductStarsSummary();
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleInputChange = (e) => {
    const message = e.target.value;

    if (message.length > 150) {
      setIsMessageExceeded(true);
    } else {
      setIsMessageExceeded(false);
    }

    setNewMessage(message);
    setIsMessageTooShort(false);
  };

  const fetchChatMessages = async () => {
    try {
      const response = await getCommentsByProductId(product.id);

      // Ordenar los comentarios según su ID de mayor a menor
      const sortedMessages = response.sort((a, b) => b.id - a.id);

      setChatMessages(sortedMessages);
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await getProductStars(cookies.get('id'));
      const starsData = response.data || []; // Si no hay datos, inicializar como un arreglo vacío
      const productRatingData = starsData.find(item => item.product === product.id);
      const userRating = productRatingData ? productRatingData.rank_prd : 0;
      setRating(userRating);
    } catch (error) {
      console.error('Failed to fetch user rating:', error);
    }
  };

  const fetchProductStarsSummary = async () => {
    try {
      const response = await getProductsStarsSummary(product.id);
      const scaledStars = response.data?.scaled_stars || 0;
      setScaledStars(scaledStars);
    } catch (error) {
      console.error('Failed to fetch product stars summary:', error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    fetchUserRating();
    fetchProductStarsSummary();
  }, [product.id]);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ❌
        </button>
        <div className="product-info-container">
          <img className="product-image" src={product.img_prd} alt={product.nam_prd} />
          <div className="product-info">
            <div className="info-row">
              <p className="product-Title">{product.nam_prd}</p>
              <p className="product-Price">${product.prc_prd}</p>
              <div><p className='startext'>Puntuacion: <span className='star'>★</span> {scaledStars}</p></div>
              <div className="rating">
                {/* Interfaz para mostrar las estrellas y permitir al usuario cambiar la valoración */}
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= rating ? 'active' : ''}`}
                    onClick={() => handleStarClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              <img className="cart-icon" src={iconInfo} alt="add to cart" />
              <p>Enviar al carrito</p>
            </button>
          </div>
        </div>
        <div className="description">
          <h2>Descripción del producto</h2>
          <p>{product.desc_prd}</p>
        </div>
        {cookies.get('module').com_usr ? (
          <div className="chat">
            <h2>Comentarios</h2>
            {isMessageExceeded && <p className="alert-message">El comentario no puede exceder los 150 caracteres.</p>}
            {isMessageTooShort && <p className="alert-message">El comentario debe tener al menos 10 caracteres.</p>}
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                maxLength={150}
                onChange={handleInputChange}
                placeholder="Escribe un comentario de este producto"
              />
              <button onClick={handleSendMessage} disabled={isSendingMessage || isMessageExceeded || isMessageTooShort}>
                {isSendingMessage ? 'Enviando...' : <AiOutlineSend/>}
              </button>
            </div>
            <div className="chat-messages">
              {chatMessages &&
                chatMessages.map((message, index) => (
                  <div key={index} className="chat-message">
                    <p className="message-name">{message.nom_com}</p>
                    <p className="message-content">{message.cont_com}</p>
                    <div className="message-date">{message.fec_com}</div>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductInfo;
