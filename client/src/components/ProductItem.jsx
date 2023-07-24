import React, { useContext, useState } from 'react';
import iconItem from '@icons/bt_add_to_cart.svg';
import AppContext from '../context/AppContext';
import '@styles/ProductItem.scss';
import ProductInfo from './ProductInfo';
import { toast } from 'react-toastify';

const ProductItem = React.memo(({ product }) => {
  const { addToCart } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClikc = (item) => {
    addToCart(item);
    toast.success(`${item.nam_prd} ha sido agregado al carrito`, {
      autoClose: 2000,
      position: "bottom-left",
      bodyClassName: "custom-toast-body",
      theme: "colored",
    });
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {product.del_prd === 1 ? (
        <div className="ProductItem">
          <img
            src={product.img_prd}
            alt={product.nam_prd}
            onClick={handleImageClick}
          />
          <div className="product-info">
            <div>
              <p>{product.nam_prd}</p>
              <p>Categoría: {product.cat_prd}</p>
              <p>${product.prc_prd}</p>
            </div>
            <figure onClick={() => handleClikc(product)}>
              <img src={iconItem} alt="Agregar al carrito" />
            </figure>
          </div>
        </div>
      ) : null}


      {modalOpen && (
        <ProductInfo
          product={product}
          onClose={closeModal}
        />
      )}

    </>
  );
});

export default ProductItem;
