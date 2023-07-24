import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import '@styles/Chatbot.scss';
import { ChatBotMessage } from '../api/chatBot.api';

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [openButton, setOpenButton] = useState(true);
    const [messages, setMessages] = useState([
        { text: '¡Hola! Soy Caya, tu asistente virtual de Vizcaya. ¿En qué puedo ayudarte?', isUser: false },
    ]);

    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (open) {
            scrollToBottom();
        }
    }, [open, messages]);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (inputText.trim() !== '') {
            const newUserMessage = { text: inputText, isUser: true };
            setInputText('');

            try {
                const response = await ChatBotMessage(inputText);
                const newBotMessage = { text: response.response, isUser: false };
                setMessages((prevMessages) => [...prevMessages, newUserMessage, newBotMessage]);
            } catch (error) {
                console.error('Error al obtener la respuesta del chatbot:', error);
            }
        }
    };

    const handleOpenChat = () => {
        setOpen(true);
        setOpenButton(false);
    };

    const handleCloseChat = () => {
        setOpenButton(true);
        setTimeout(() => {
            setOpen(false);
        }, 300); // Espera 300 ms antes de cerrar completamente el chatbot para permitir que se complete la animación
    };

    return (
        <>
            {openButton && !open ? (
                <button type="button" className="OpenButton" onClick={handleOpenChat}>
                    Asistente Virtual
                </button>
            ) : null}

            <div className={`chatbot-container ${open ? 'open' : ''}`}>
                {open ? (
                    <>
                        <button type="button" className="closeButton" onClick={handleCloseChat}>
                            X
                        </button>
                        <div className="chat">
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                                    <div className="message-content">{message.text}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Escribe tu mensaje..."
                                value={inputText}
                                onChange={handleInputChange}
                                onKeyPress={handleInputKeyPress} // Agrega este evento onKeyPress
                            />
                            <button onClick={handleSendMessage}>
                                <AiOutlineSend />
                            </button>
                        </div>
                    </>
                ) : null}
            </div>
        </>
    );
};

export default Chatbot;
