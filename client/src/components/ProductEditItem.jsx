import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuditProduct } from '../api/products.api.js';
import Cookies from 'universal-cookie';
import '@styles/ProductItem.scss';

const ProductEditItem = ({ product }) => {
  const cookies = new Cookies();
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (item) => {
    nav(`/edit-product/${item.id}`);
    window.location.reload(); // Refrescar la página
  };

  const handleDelete = (item) => {
    if (cookies.get('module').delete_prd) {
      setShowModal(true);
    }
  };

  const handleRestore = async (item) => {
    // Obtener el id del usuario desde la cookie
    const userId = parseInt(cookies.get('id'));

    // Crear la auditoría con la acción de restauración (R)
    const auditData = {
      product_id: parseInt(item.id),
      user_id: userId,
      action: 'R',
    };

    try {
      // Crear la auditoría antes de realizar la restauración
      await createAuditProduct(auditData);

      // Realizar la restauración del producto
      nav(`/restore-product/${item.id}`);
      setTimeout(() => {
        nav(-1); // Redirigir a la página anterior después de 1000 milisegundos (1 segundo)
        window.location.reload(); // Refrescar la página
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAdmin = (item) => {
    if (cookies.get('module').delete_prd) {
      setShowModal(true);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = async (item) => {
    setShowModal(false);
    // Obtener el id del usuario desde la cookie
    const userId = parseInt(cookies.get('id'));

    // Crear la auditoría con la acción de eliminación (D)
    const auditData = {
      product_id: parseInt(item.id), // Convertir id a número si no lo está ya
      user_id: userId,
      action: 'D',
    };

    try {
      // Crear la auditoría antes de realizar la eliminación lógica
      await createAuditProduct(auditData);

      // Realizar la eliminación lógica del producto
      nav(`/delete-product/${item.id}`);
      setTimeout(() => {
        nav(-1); // Redirigir a la página anterior después de 1000 milisegundos (1 segundo)
        window.location.reload(); // Refrescar la página
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="ProductItem">
      <img src={product.img_prd} alt={product.nam_prd} />
      <div className="product-info">
        <div>
          <p>{product.nam_prd}</p>
          <p>Category: {product.cat_prd}</p>
          <p>${product.prc_prd}</p>
        </div>
        {cookies.get('module').edit_prd && (

          <div className="admin-buttons">
            {cookies.get('module').delete_prd && (
              product.del_prd === 1 ? (
                <figure onClick={() => handleDelete(product)}>
                  <p title="Eliminar logicamente">❌</p>
                </figure>
              ) : (
                <figure onClick={() => handleRestore(product)}>
                  <p title="Restaurar">🔃</p>
                </figure>
              )
            )}
            <figure onClick={() => handleEdit(product)}>
              <p title="Editar">✏️</p>
            </figure>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modalD">
          <div className="modal-contentD">
            <h3>¿Estás seguro que quieres eliminar este producto?</h3>
            <p>{product.nam_prd}</p>
            <div className="modal-buttonsD">
              <button onClick={handleCancelDelete}>Cancelar</button>
              <button onClick={() => handleConfirmDelete(product)}>Sí</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditItem;
