import React, { useState, useContext } from 'react';
import '@styles/Header.scss';
import menu from '@icons/icon_menu.svg'
import iconCart from '@icons/icon_shopping_cart.svg'
import MyOrder from '@containers/MyOrder'
import Menu from '@components/Menu'
import AppContext from '@context/AppContext'
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';
import logo from '@logos/Vizcaya_logo.png';


const cookies = new Cookies()
const Header = () => {
	const [toggle, setToggle] = useState(false)
	const [toggleOrders, setToggleOrders] = useState(false)

	const { state } = useContext(AppContext)

	const handleToggle = () => {
		setToggle(!toggle)
	}
	const handleToggleOrders = () => {
		setToggleOrders(!toggleOrders)
	}

	return (
		<nav className='navPage'>
			<div className="navbar-left">
				<img src={logo} alt="" className='logoVizcaya'/>
			</div>
			<img src={menu} alt="menu" className="menu" />
			<div className="navbar-right">
				<ul>
					<li className="navbar-email" >
						{`Usuario: ${cookies.get('nam_reg')} // ${cookies.get('eml_reg')}`}
					</li>
					<li className='createProductsButton'>
						<Button variant="contained" onClick={handleToggle}>Menu</Button>
					</li>
					<li className="navbar-shopping-cart" onClick={handleToggleOrders}>
						<img src={iconCart} title="Carrito de compras" />
						{state.cart.length > 0 ? <div>{state.cart.length}</div> : null}
					</li>
				</ul>
			</div>
			{toggle && <Menu />}
			{toggleOrders && <MyOrder />}
		</nav>
	);
}

export default Header;