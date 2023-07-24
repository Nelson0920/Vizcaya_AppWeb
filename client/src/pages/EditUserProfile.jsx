import React, { useState} from 'react';
import { updateRegister } from '../api/register.api';
import { useNavigate } from 'react-router-dom';
import '@styles/EditUserProfile.scss'; // Importamos los estilos SCSS
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const EditUserProfile = ({ userData }) => {
  // Verificamos si userData está definido y contiene las propiedades requeridas
  const defaultUserData = {
    nam_reg: '',
    eml_reg: '',
    cell_reg: '',
    pwd_reg: '',
  };
  const validUserData = userData || defaultUserData;

  // Utilizamos las cookies para establecer los valores iniciales de los campos de entrada
  const [name, setName] = useState(cookies.get('nam_reg') || validUserData.nam_reg);
  const [email, setEmail] = useState(cookies.get('eml_reg') || validUserData.eml_reg);
  const [cell, setCell] = useState(cookies.get('cell_reg') || validUserData.cell_reg);
  const [password, setPassword] = useState('');

  // Hook navigate para volver al home
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        nam_reg: name,
        eml_reg: email,
        cell_reg: cell,
        pwd_reg: password,
      };

      // Actualizar las cookies con la información más reciente
      cookies.set('nam_reg', name, { path: '/' });
      cookies.set('eml_reg', email, { path: '/' });
      cookies.set('cell_reg', cell, { path: '/' });

      const response = await updateRegister(cookies.get('id'), updatedUserData);
      console.log(response); // Handle success response or show a success message
    } catch (error) {
      console.error(error); // Handle error or show an error message
    }
  };

  return (
    <div className="edit-user-profile">
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
      <button className="back-button" onClick={() => navigate('/home')}>
        Volver al Home
      </button>
    </div>
  );
};