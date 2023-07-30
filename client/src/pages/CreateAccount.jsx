import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createRegister } from '../api/register.api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@styles/CreateAccount.scss';
import emailjs from 'emailjs-com';

export const CreateAccount = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const nav = useNavigate();
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoValido, setCodigoValido] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createRegister(data);
      nav('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error('El correo electrónico ya está en uso', { theme: "colored" });
      } else {
        toast.error('Ocurrió un error. Por favor, inténtelo de nuevo más tarde.', { theme: "colored" });
      }
    }
  });

  const login = () => {
    nav('/login');
  };

  const goHome = () => {
    nav('/');
  };

  const enviarCodigo = async () => {
    const correo = document.getElementById('email').value;
    const codigo = Math.floor(100000 + Math.random() * 900000);
    console.log(codigo)
    setCodigo(codigo);
    console.log(codigo)
    const serviceId = 'service_01njsy9';
    const templateId = 'template_i7dca1v';
    const userId = 'l4AO92mPnl8iRKao4';

    const templateParams = {
      from_name: 'Vizcaya_app@gmail.com',
      to_name: correo,
      subject: 'Código de validación',
      message: `Tu código de validación es: ${codigo}`,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, userId);
      toast.info(`Se ha enviado un codigo de verficacion a tu correo.`, { theme: "colored" });
      setCodigoEnviado(true);
      setValue('codigo_reg', '');
    } catch (error) {
      toast.error('Error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.', { theme: "colored" });
    }
  };

  const validarCodigo = () => {
    const codigoIngresado = document.getElementById('codigo').value;

    if (parseInt(codigoIngresado) === parseInt(codigo)) {
      setCodigoValido(true);
    } else {
      setCodigoValido(false);
      toast.error('El código ingresado es incorrecto', { theme: "colored" });
    }
  };

  const validateEmail = (value) => {
    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    if (!isValidEmail) {
      setEmailError('El campo de correo electrónico debe ser válido');
    } else {
      setEmailError('');
    }
  };

  const validatePhoneNumber = (value) => {
    const isValidPhoneNumber = /^(\+58)?(0(414|424|416|426|412|276))-?\d{7}$/.test(value);
    if (!isValidPhoneNumber) {
      setPhoneError('Numero de telefono invalido');
    } else {
      setPhoneError('');
    }
  };

  const validatePassword = (value) => {
    const isValidPassword = /^(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{10,20}$/.test(value);
    if (!isValidPassword) {
      setPasswordError('La contraseña debe tener al menos 2 números, 1 carácter especial y tener entre 10 y 20 caracteres');
    } else {
      setPasswordError('');
    }
  };

  // Limpiar los errores después de un cierto tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailError('');
      setPhoneError('');
      setPasswordError('');
    }, 2000);

    return () => clearTimeout(timer);
  }, [emailError, phoneError, passwordError]);


  if(phoneError){
    toast.error(`${phoneError}`, {theme: "colored"})
  }

  if(emailError){
    toast.error(`${emailError}`, {theme: "colored"})
  }

  if(passwordError){
    toast.error(`${passwordError}`, {theme: "colored"})
  }

  if(errors.codigo_reg){
    toast.error(`El campo de código es requerido`, {theme: "colored"})
  }

  return (
    <div className="CreateAccount">
      <div className="CreateAccount-container">
        <h1 className="titleA">Mi cuenta</h1>
        <ToastContainer />
        <form onSubmit={onSubmit} className="form">
          <div>
            <label htmlFor="name" className="label">Nombre</label>
            <input type="text" id="name" placeholder="Full Name" className="input input-name" {...register('nam_reg', { required: true })} />

            <label htmlFor="email" className="label">Correo</label>
            <input type="text" id="email" placeholder="name@example.com" className="input input-email" {...register('eml_reg', { required: true, validate: validateEmail })} />


            {codigoEnviado && !codigoValido && (
              <div>
                <label htmlFor="codigo" className="label">Código</label>
                <input type="text" id="codigo" placeholder="Código de validación" className="input input-codigo" {...register('codigo_reg', { required: true })} />
              </div>
            )}

            <label htmlFor="cellphone" className="label">Numero de telefono</label>
            <input type="text" id="cellphone" placeholder="+58400-0000000" maxLength={11} className="input input-email" {...register('cell_reg', { required: true, validate: validatePhoneNumber })}
              onKeyPress={(e) => {
                const keyCode = e.keyCode || e.which;
                const keyValue = String.fromCharCode(keyCode);
                const isValidInput = /^[0-9.]+$/.test(keyValue);
                if (!isValidInput) {
                  e.preventDefault();
                }
              }} />

            <label htmlFor="password" className="label">Contraseña</label>
            <input type="password" id="password" placeholder="************" className="input input-password" {...register('pwd_reg', { required: true, validate: validatePassword })} />
          </div>

          {!codigoEnviado && (
            <button type="button" className="primary-button" onClick={enviarCodigo}>Enviar código</button>
          )}

          {codigoEnviado && !codigoValido && (
            <button type="button" className="primary-button" onClick={validarCodigo}>Validar código</button>
          )}

          {codigoValido && (
            <input type="submit" value="Create" className="primary-button login-button" />
          )}

          <input type="button" value="Iniciar sesión" className="secondary-button signup-button" onClick={login} />
          <button onClick={goHome} className="home-button">🡸 Inicio</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
