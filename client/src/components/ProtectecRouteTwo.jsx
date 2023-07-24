import React from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies()

export const ProtectedRouteTwo = ({ isAllowed, children}) => {
    if(isAllowed){
		const cookieNames = Object.keys(cookies.getAll());

		cookieNames.forEach((cookieName) => {
			cookies.remove(cookieName, { path: '/' });
		});

		window.location.href = '/';
    }
    return children ? children : <Outlet/>
}