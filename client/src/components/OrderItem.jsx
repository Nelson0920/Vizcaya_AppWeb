import React, { useContext, useState } from 'react';
import AppContext from '@context/AppContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@styles/OrderItem.scss';

const OrderItem = ({ product, indexValue }) => {
	const { removeFromCart } = useContext(AppContext);

	const handleRemove = () => {
		removeFromCart(indexValue);
		toast.info(`${product.nam_prd} eliminado del carrito`, {
			position: "bottom-left",
			autoClose: 2000,
			theme: "colored",
		});
	};

	return (
		<div className="OrderItem">
			<figure>
				<img src={product.img_prd} alt={product.nam_prd} />
			</figure>
			<p>{product.nam_prd}</p>
			<button className="deleteProduct" onClick={handleRemove} alt="close">
				X
			</button>
		</div>
	);
};

export default OrderItem;
