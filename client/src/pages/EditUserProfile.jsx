import React, { useState } from 'react';
import { updateRegister } from '../api/register.api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import '@styles/EditUserProfile.scss';
import Cookies from 'universal-cookie';
import userIcon from '../assets/icons/iconUser.png';

const cookies = new Cookies();

export const EditUserProfile = ({ userData }) => {
  const defaultUserData = {
    nam_reg: '',
    eml_reg: '',
    cell_reg: '',
    pwd_reg: '',
  };
  const validUserData = userData || defaultUserData;

  const [name, setName] = useState(cookies.get('nam_reg') || validUserData.nam_reg);
  const [email, setEmail] = useState(cookies.get('eml_reg') || validUserData.eml_reg);
  const [cell, setCell] = useState(cookies.get('cell_reg') || validUserData.cell_reg);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        nam_reg: name,
        eml_reg: email,
        cell_reg: cell,
        pwd_reg: password,
      };

      cookies.set('nam_reg', name, { path: '/' });
      cookies.set('eml_reg', email, { path: '/' });
      cookies.set('cell_reg', cell, { path: '/' });

      const response = await updateRegister(cookies.get('id'), updatedUserData);
      toast.success(`${response.message}`, { theme: "colored" });
    } catch (error) {
      
      if(error.response.data){
        toast.error('Todos los campos son necesarios', { theme: "colored" });

        if(error.response.data.pwd_reg){
          toast.error('Es necesario que el campo de contraseña este con la contraseña actual o con la contraseña nueva para actualizar los datos', { theme: "colored" });
        }
      }
    }
  };

  const goHome = () => {
    nav('/home');
  };

  const validatePassword = (value) => {
    const isValidPassword = /^(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{10,20}$/.test(value);
    if (!isValidPassword) {
      setPasswordError('La contraseña debe tener al menos 2 números, 1 carácter especial y tener entre 10 y 20 caracteres');
    } else {
      setPasswordError('');
      setPassword(value)
    }
  };

  const validateEmail = (value) => {
    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    if (!isValidEmail) {
      setEmailError('El campo de correo electrónico debe ser válido');
    } else {
      setEmailError('');
      setEmail(value)
    }
  };

  if(passwordError){
    toast.error(`${passwordError}`, {theme: "colored"})
  }

  if(emailError){
    toast.error(`${emailError}`, {theme: "colored"})
  }

  return (
    <div className="edit-user-profile">
      <ToastContainer />
      <div className="user-image">
        <img src={userIcon} alt="User Icon" />
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cell">Teléfono:</label>
            <input
              type="text"
              id="cell"
              value={cell}
              onChange={(e) => setCell(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => validatePassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button">
            Guardar cambios
          </button>
        </form>
        <button onClick={goHome} className="home-button">🡸 Volver</button>
      </div>
    </div>
  );
};