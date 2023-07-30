import React, { useEffect } from 'react';
import { loginUser } from '../api/register.api';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@styles/Login.scss';

const Login = () => {
	const cookies = new Cookies();
	const nav = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = handleSubmit(async (data) => {
		try {
			const response = await loginUser(data);
			const user = response.user;

			if (user) {
				cookies.set('id', user.id, { path: '/' });
				cookies.set('nam_reg', user.nam_reg, { path: '/' });
				cookies.set('eml_reg', user.eml_reg, { path: '/' });
				cookies.set('rol_reg', user.rol_reg, { path: '/' });
				cookies.set('cell_reg', user.cell_reg, { path: '/' });
				cookies.set('module', user.module, { path: '/' });
				toast.success('Inicio de sesión exitoso', {theme: "colored",});
			} else {
				toast.error('Usuario no encontrado', {theme: "colored",});
			}
		} catch (error) {
			toast.error('Error al autenticar usuario', {theme: "colored",});
		}
	});

	useEffect(() => {
		if (
			cookies.get('id') &&
			cookies.get('nam_reg') &&
			cookies.get('eml_reg') &&
			cookies.get('rol_reg') &&
			cookies.get('cell_reg') &&
			cookies.get('module')
		) {
			window.location.assign('/home');
		}
	}, [cookies]);

	const signup = () => {
		nav('/register');
	};

	const goHome = () => {
		nav('/');
	};

	return (
		<div className="Login">
			<div className="Login-container">
				<h1 className="titleL">Iniciar sesión</h1>
				<ToastContainer />
				<form action="/" className="form" onSubmit={onSubmit}>
					<label htmlFor="email" className="label">
						Correo electrónico
					</label>
					<input
						type="text"
						name="email"
						placeholder="name@example.com"
						className="input input-email"
						{...register('eml_reg', { required: true })}
					/>
					{errors.eml_reg && (
						<span className='numErr'>
							{toast.error('El campo de correo es requerido', {theme: "colored",})}

						</span>
					)}

					<label htmlFor="password" className="label">
						Correo
					</label>
					<input
						type="password"
						name="password"
						placeholder="*********"
						className="input input-password"
						{...register('pwd_reg', { required: true })}
					/>
					{errors.pwd_reg && (
						<span className='numErr'>
							{toast.error('El campo de contraseña es requerido', {theme: "colored",})}

						</span>
					)}

					<input type="submit" className="primary-button login-button" value="Login" />
				</form>
				<button onClick={signup} className="secondary-button signup-button">
					Registrate
				</button>
				<button onClick={goHome} className="home-button">
					🡸 Inicio
				</button>
			</div>
		</div>
	);
};

export default Login;
