import React, { useEffect, useState, useRef } from 'react';
import { getUsersOrders } from '../api/products.api';
import { useNavigate } from 'react-router-dom';
import '@styles/SalesHistory.scss';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const SalesHistory = () => {
  const [salesHistory, setSalesHistory] = useState([]);
  const [searchText, setSearchText] = useState('');
  const nav = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchSalesHistory = async () => {
      try {
        const response = await getUsersOrders();
        setSalesHistory(response.data);
      } catch (error) {
        console.log('Error fetching sales history:', error);
      }
    };

    fetchSalesHistory();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredSalesHistory = salesHistory.filter((user) =>
    user.nam_reg.toLowerCase().includes(searchText.toLowerCase())
  );

  const goHome = () => {
    nav('/view-admin');
  };

  const generatePDF = () => {

    const table = tableRef.current;

    const doc = new jsPDF();

    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');


      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);

      doc.save('sales_history.pdf');
    });
  };

  return (
    <div className="sales-history">
      <button onClick={goHome} className="home-button">
        🡸 Volver
      </button>
      <button onClick={generatePDF} className="generate-pdf-button">
        Generar PDF
      </button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Busca por el nombre..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <div className="sales-history-table" ref={tableRef}>
        {filteredSalesHistory.map((user) => (
          <div key={user.id} className="user">
            <h2>{user.nam_reg}</h2>
            {user.orders.map((order) => (
              <div key={order.id} className="order">
                <p>Date: {new Date(order.fec_ord).toLocaleString()}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.order_details
                      .filter((orderDetail) => orderDetail.id_ord === order.id)
                      .map((orderDetail) => (
                        <tr key={orderDetail.id}>
                          <td>{orderDetail.product.nam_prd}</td>
                          <td>${orderDetail.product.prc_prd}</td>
                          <td>{orderDetail.qty_prd}</td>
                          <td>${orderDetail.sub_prd}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <p className="order-total">Total: ${order.tot_ord}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
