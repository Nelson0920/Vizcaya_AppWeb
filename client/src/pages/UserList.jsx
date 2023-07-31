import React, { useEffect, useState, useRef } from 'react';
import { getAllRegister } from '../api/register.api';
import { useNavigate } from 'react-router-dom';
import '@styles/UserList.scss';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const tableRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllRegister();
        setUsers(response.data);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nam_reg.toLowerCase().includes(searchText.toLowerCase()) ||
      user.eml_reg.toLowerCase().includes(searchText.toLowerCase()) ||
      user.cell_reg.includes(searchText)
  );

  const generatePDF = () => {
    const table = tableRef.current;
    const doc = new jsPDF();

    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('user_list.pdf');
    });
  };

  const goHome = () => {
    nav('/view-admin');
  };

  return (
    <div className="shopping-history">
      <button onClick={goHome} className="home-button">
        🡸 Volver
      </button>
      <button onClick={generatePDF} className="generate-pdf-button">
        Generar PDF
      </button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Busca por nombre, correo o celular..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <div className="containerHistory">
        <table ref={tableRef}>
          <thead>
            <tr>
              <th colSpan={5} className='titleTable'>Lista de Usuarios</th>
            </tr>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Celular</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.nam_reg}</td>
                <td>{user.eml_reg}</td>
                <td>{user.cell_reg}</td>
                <td>{user.fec_reg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
