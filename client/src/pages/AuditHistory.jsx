import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuditProduct } from '../api/products.api';
import '@styles/ShoppingHistory.scss'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const AuditHistory = () => {
  const nav = useNavigate();
  const [auditData, setAuditData] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    // Llamar a la función para obtener los datos de auditoría desde el backend
    getAuditProduct()
      .then((response) => {
        setAuditData(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de auditoría:', error);
      });
  }, []);

  const generatePDF = () => {
    const table = tableRef.current; // Obtenemos la referencia al elemento de la tabla
    const doc = new jsPDF();

    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('audit_history.pdf');
    });
  };

  return (
    <div className="shopping-history">
      <button className="home-button" onClick={() => nav('/view-admin')}>
        🡸 Volver
      </button>
      <button className="generate-pdf-button" onClick={generatePDF}>
        Generar PDF
      </button>
      <div className="containerHistory">
        <table ref={tableRef}>
          <thead>
            <tr>
              <th>Nombre del Usuario</th>
              <th>Nombre del Producto</th>
              <th>Acción</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {auditData.map((audit) => (
              <tr key={audit.id}>
                <td>{audit.nam_reg}</td>
                <td>{audit.nam_prd}</td>
                <td>{audit.action}</td>
                <td>{audit.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
