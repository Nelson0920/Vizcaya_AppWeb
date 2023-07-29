import React, { useEffect, useState, useRef } from 'react';
import { getOrdersByClientId } from '../api/products.api';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '@styles/ShoppingHistory.scss';

const cookies = new Cookies();

export const ShoppingHistory = () => {
  const clientId = cookies.get('id');
  const [shoppingHistory, setShoppingHistory] = useState([]);
  const nav = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchShoppingHistory = async () => {
      try {
        const response = await getOrdersByClientId(clientId);
        setShoppingHistory(response.data);
      } catch (error) {
        console.log('Error al obtener el historial de compras:', error);
      }
    };

    fetchShoppingHistory();
  }, [clientId]);

  const goBack = () => {
    nav('/home');
  };

  const generatePDF = () => {
    // Get the table element to capture
    const table = tableRef.current;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Use html2canvas to capture the table element and create an image
    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);

      // Save the PDF
      doc.save('shopping_history.pdf');
    });
  };

  // Reorganize data to group products by order
  const groupedShoppingHistory = shoppingHistory.reduce((acc, order) => {
    const existingOrder = acc.find((groupedOrder) => groupedOrder.id === order.id);
    if (existingOrder) {
      existingOrder.products.push(...order.order_details);
    } else {
      acc.push({ ...order, products: order.order_details });
    }
    return acc;
  }, []);

  return (
    <div className="shopping-history">
      <button onClick={goBack} className="home-button">
        🡸 Volver
      </button>
      <button onClick={generatePDF} className="generate-pdf-button">
        Generar PDF
      </button>
      <div className="containerHistory" ref={tableRef}>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {groupedShoppingHistory.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td rowSpan={order.products.length}>{new Date(order.fec_ord).toLocaleString()}</td>
                  <td>
                    <div className="product-info">
                      <img src={order.products[0].product.img_prd} alt={order.products[0].product.nam_prd} />
                      <div>
                        <h3>{order.products[0].product.nam_prd}</h3>
                      </div>
                    </div>
                  </td>
                  <td>${order.products[0].product.prc_prd}</td>
                  <td>{order.products[0].order_detail.qty_prd}</td>
                  <td>${order.products[0].order_detail.sub_prd}</td>
                </tr>
                {order.products.slice(1).map((product) => (
                  <tr key={product.order_detail.id}>
                    <td>
                      <div className="product-info">
                        <img src={product.product.img_prd} alt={product.product.nam_prd} />
                        <div>
                          <h3>{product.product.nam_prd}</h3>
                        </div>
                      </div>
                    </td>
                    <td>${product.product.prc_prd}</td>
                    <td>{product.order_detail.qty_prd}</td>
                    <td>${product.order_detail.sub_prd}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" className="order-total">
                    Total de la Orden: ${order.tot_ord}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
