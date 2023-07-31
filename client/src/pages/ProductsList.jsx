import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../api/products.api';
import '@styles/ShoppingHistory.scss'; // Importamos los estilos del archivo ShoppingHistory.scss
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ProductList = () => {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    // Llamar a la función para obtener los datos de los productos desde el backend
    getAllProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de productos:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nam_prd.toLowerCase().includes(searchText.toLowerCase()) ||
      product.desc_prd.toLowerCase().includes(searchText.toLowerCase()) ||
      product.cat_prd.toLowerCase().includes(searchText.toLowerCase())
  );

  const generatePDF = () => {
    const table = tableRef.current; // Obtenemos la referencia al elemento de la tabla
    const doc = new jsPDF();

    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('product_list.pdf');
    });
  };

  return (
    <div className="shopping-history"> {/* Aplicamos la clase 'shopping-history' */}
      <button className="home-button" onClick={() => nav('/view-admin')}>
        🡸 Volver
      </button>
      <button className="generate-pdf-button" onClick={generatePDF}>
        Generar PDF
      </button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Busca por nombre, descripción o categoría..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <div className="containerHistory"> {/* Aplicamos la clase 'containerHistory' */}
        <table ref={tableRef}>
          <thead>
            <tr>
              <th colSpan={5} className='titleTable'>Lista de Productos</th>
            </tr>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.nam_prd}</td>
                <td>{product.desc_prd}</td>
                <td>${product.prc_prd}</td>
                <td>{product.qty_prd}</td>
                <td>{product.cat_prd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
