import React from 'react';
import '@styles/Menu.scss';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Menu = () => {
	const handleSignOut = () => {
		const cookieNames = Object.keys(cookies.getAll());

		cookieNames.forEach((cookieName) => {
			cookies.remove(cookieName, { path: '/' });
		});

		window.location.href = '/';
	};

	return (
		<div className="Menu">
			<ul>
				{(cookies.get('module').dashboard) ?
				<li>
					<a href="/view-admin" className="title">Admin</a>
				</li>
				: null}
				{(cookies.get('module').settings) ?
				<li>
					<a href="/user-settings" className="title">Settings</a>
				</li>
				: null}
				{(cookies.get('module').shopping_history) ?
				<li>
					<a href="/history" className="title">Compras</a>
				</li>
				: null}
				<li>
					<a onClick={handleSignOut}>Sign out</a>
				</li>
			</ul>
		</div>
	);
};

export default Menu;
