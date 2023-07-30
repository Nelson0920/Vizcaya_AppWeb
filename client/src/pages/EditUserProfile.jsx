import React, { useState } from 'react';
import { updateRegister } from '../api/register.api';
import { useNavigate } from 'react-router-dom';
import '@styles/EditUserProfile.scss'; // Importamos los estilos SCSS
import Cookies from 'universal-cookie';
import userIcon from '../assets/icons/iconUser.png'; // Importamos la imagen

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
      console.log(response); // Handle success response or show a success message
    } catch (error) {
      console.error(error); // Handle error or show an error message
    }
  };

  const goHome = () => {
    nav('/home');
  };

  return (
    <div className="edit-user-profile">
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
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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