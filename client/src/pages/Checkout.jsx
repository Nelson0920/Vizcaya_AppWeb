import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppContext from '@context/AppContext';
import data from '../json/estados.json';
import datazip from '../json/zip.json';
import { sendDataClient } from '../api/buy.api';
import { updateProductQty, createOrder, createOrderDetail } from '../api/products.api';
import emailjs from 'emailjs-com';
import '@styles/Checkout.scss';
import Cookies from 'universal-cookie';
import { PayPalButton } from 'react-paypal-button-v2';

const cookies = new Cookies();

export const Checkout = () => {
  const location = useLocation();
  const cartData = location.state?.cartData || [];

  // Datos del usuario
  const [ced_cli, setCedula] = useState('');
  const [add_cli, setAddress] = useState('');
  const [sta_cli, setState] = useState('');
  const [cit_cli, setCity] = useState('');
  const [zip_cli, setZipCode] = useState('');

  // Datos de la tarjeta de crédito
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCVV] = useState('');
  const [cardError, setCardError] = useState('');

  const [dataUser, setDataUser] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1);

  const { removeFromCart } = useContext(AppContext);
  const nav = useNavigate();

  // Función para realizar el proceso de checkout
  const handleCheckout = async () => {
    // Vaciar el carrito después de la compra
    cartData.forEach(({ product }) => {
      removeFromCart(product.id);
    });

    // Actualizar la cantidad de productos en la base de datos
    for (let i = 0; i < cartData.length; i++) {
      const { product, quantity } = cartData[i];
      if (product && product.qty_prd && quantity) {
        const difference = product.qty_prd - quantity;
        try {
          await updateProductQty(product.id, difference);
          console.log('Actualización exitosa');
        } catch (error) {
          console.error('Error al actualizar la cantidad del producto:', error);
        }
      }
    }

    // Enviar correo electrónico al cliente
    await sendEmail();

    alert('¡Compra completada!');
  };

  // Manejar el cambio de código postal
  const handleZipChange = (zipCode) => {
    const selectedState = Object.keys(datazip).find(
      (estado) => datazip[estado].includes(zipCode)
    );
    if (selectedState) {
      setState(selectedState);
    } else {
      setState('');
    }
    setZipCode(zipCode);

    if (zipCode.endsWith('01')) {
      const cities = data.ciudades[selectedState] || [];
      if (cities.length > 0) {
        setCity(cities[0]);
      }
    }
  };

  // Manejar el cambio de estado
  const handleEstadoChange = (estado) => {
    const zipCodes = datazip[estado] || [];
    if (zipCodes.length > 0) {
      setZipCode(zipCodes[0]);
    } else {
      setZipCode('');
    }
    setState(estado);
  };

  // Obtener el año actual
  const currentYear = new Date().getFullYear();

  // Validar el número de tarjeta de crédito
  const validateCardNumber = (cardNumber) => {
    const sanitizedCardNumber = cardNumber.replace(/\s/g, '');

    if (/[^0-9-\s]+/.test(sanitizedCardNumber)) {
      return 'El número de tarjeta es inválido.';
    }

    const isAmericanExpress = sanitizedCardNumber.length === 15;
    const sum = sanitizedCardNumber
      .split('')
      .reverse()
      .map((digit, index) => {
        let num = parseInt(digit, 10);
        if (index % 2 === 1) {
          num *= 2;
          if (num > 9) {
            num -= 9;
          }
        }
        return num;
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (sum % 10 !== 0) {
      return 'El número de tarjeta es inválido.';
    }

    if (isAmericanExpress && sanitizedCardNumber[0] !== '3') {
      return 'El número de tarjeta es inválido.';
    }

    return '';
  };

  // Enviar los datos del usuario
  const handleSubmit = async (event) => {
    event.preventDefault();

    const buttonClicked = event.nativeEvent.submitter.getAttribute('name');

    console.log(buttonClicked)

    if (buttonClicked === 'payWithCard') {
      setCheckoutStep(2);
    } else if (buttonClicked === 'payWithPaypal') {
      setCheckoutStep(3);
    }
    const userData = {
      id_user: cookies.get('id'),
      ced_cli,
      add_cli,
      sta_cli,
      cit_cli,
      zip_cli,
    };

    setDataUser(userData);
  };

  // Enviar los datos de la tarjeta y procesar el pago
  const handleSubmitCard = (e) => {
    e.preventDefault();

    const error = validateCardNumber(cardNumber);
    setCardError(error);

    if (error) {
      return;
    }

    const cardData = {
      cardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
    };

    sendData(dataUser);

    handleCheckout();
  };

  // Manejar el proceso de pago con PayPal
  const handlePayPalSuccess = async (payment) => {
    // Aquí puedes realizar las acciones necesarias después de un pago exitoso con PayPal.
    // Por ejemplo, enviar los datos de compra y del cliente.
    sendData(dataUser);

    handleCheckout();
    // También puedes mostrar una notificación o redirigir a una página de confirmación.
    alert('Pago realizado con éxito');
    setCheckoutStep(3);
  };

  const handlePayPalError = (error) => {
    // Manejar errores en el pago de PayPal
    console.error('Error en el pago de PayPal:', error);
  };

  // Enviar los datos del usuario al servidor
  const sendData = async (userData) => {
    try {
      const clientData = await sendDataClient(userData);
      console.log('Datos del cliente guardado:', clientData);

      const orderData = {
        id_cli: clientData.id,
        sub_iva: calculateTotal(subtotal).toFixed(2),
        tot_ord: calculateTotal(subtotal).toFixed(2),
      };

      const createdOrder = await createOrder(orderData);
      console.log('Orden creada:', createdOrder);

      // Actualizar la cantidad de productos en la base de datos
      for (let i = 0; i < cartData.length; i++) {
        const { product, quantity } = cartData[i];
        if (product && product.qty_prd && quantity) {
          const orderDetailData = {
            id_prd: product.id,
            id_ord: createdOrder.id,
            qty_prd: quantity,
            sub_prd: calculateSubtotal(parseFloat(product.prc_prd), quantity),
          };
          await createOrderDetail(orderDetailData);
          console.log('Detalle de orden creado');
        }
      }
    } catch (error) {
      console.error('Error en sendData:', error);
    }
  };

  // Calcular el subtotal de un producto
  const calculateSubtotal = (price, quantity) => {
    return price * quantity;
  };

  // Calcular el total de la compra
  const calculateTotal = (subtotal) => {
    const iva = 0.03;
    return subtotal + subtotal * iva;
  };

  // Calcular el subtotal de los productos en el carrito
  const subtotal = cartData.reduce((total, { product, quantity }) => {
    const productSubtotal = calculateSubtotal(
      parseFloat(product.prc_prd),
      quantity
    );
    return total + productSubtotal;
  }, 0);

  // Navegar a la página de inicio
  const goHome = () => {
    nav('/home');
  };

  // Enviar correo electrónico al cliente
  const sendEmail = async () => {
    const serviceId = 'service_01njsy9';
    const templateId = 'template_23ysfs9';
    const userId = 'l4AO92mPnl8iRKao4';

    const templateParams = {
      from_name: 'Vizcaya_app@gmail.com',
      to_name: cookies.get('eml_reg'),
      subject: 'factura por la compra en Vizcaya_app',
      message_html: `
      <ul class="product-list" style="background-color: #F9F9F9; padding: 10px;">
        ${cartData
          .map(({ product, quantity }) => {
            const productSubtotal = parseFloat(product.prc_prd) * quantity;

            return `
            <li key=${product.id} style="background-color: #FFFFFF; border-radius: 5px; margin-bottom: 10px;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding-left: 10px;">
                    <h4 style="font-weight: bold; color: #333; margin: 0;">${product.nam_prd
              }</h4>
                    <p style="color: #777; margin: 5px 0;">Cantidad: ${quantity}</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="font-weight: bold; color: #555; margin: 0;">$${productSubtotal.toFixed(
                2
              )}</p>
                  </td>
                </tr>
              </table>
            </li>
          `;
          })
          .join('')}
      </ul>
      <table class="total" style="background-color: #FFFFFF; width: 100%; border-radius: 5px; margin-top: 10px; padding: 10px;">
        <tr>
          <th style="font-weight: bold; color: #333; text-align: left;">Subtotal:</th>
          <td style="text-align: right;">
            <p style="font-weight: bold; color: #555; margin: 0;">$${subtotal.toFixed(
            2
          )}</p>
          </td>
        </tr>
        <tr>
          <th style="font-weight: bold; color: #333; text-align: left;">Total + 3% IVA:</th>
          <td style="text-align: right;">
            <p style="font-weight: bold; color: #555; margin: 0;">$${(
          subtotal * 1.03
        ).toFixed(2)}</p>
          </td>
        </tr>
        <tr>
          <th style="font-weight: bold; color: #333; text-align: left; font-size: 16px;">Total a pagar:</th>
          <td style="text-align: right;">
            <p style="font-weight: bold; color: #555; font-size: 18px; margin: 0;">$${(
          subtotal * 1.03
        ).toFixed(2)}</p>
          </td>
        </tr>
      </table>
      <p style="font-weight: bold; color: #333;">Detalles del usuario:</p>
      <p style="color: #777; margin: 5px 0;">Cédula: ${dataUser.ced_cli}</p>
      <p style="color: #777; margin: 5px 0;">Estado: ${dataUser.sta_cli}</p>
      <p style="color: #777; margin: 5px 0;">Dirección de compra: ${dataUser.add_cli
        }</p>
      
      <p style="margin-top: 20px; color: #777;">De parte de Vizcaya_app.</p>
      `,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, userId);
      console.log('Correo electrónico enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  };

  return (
    <div className="Bigbox">
      <div className="boxBackground">
        <div className="box1">
          <button onClick={goHome} className="home-button">
            🡸 Salir
          </button>

          <h3 className="cartProducts">Productos en el carrito:</h3>
          <div className="Checkout">
            <ul className="product-list">
              {cartData.map(({ product, quantity }) => {
                const productSubtotal = calculateSubtotal(
                  parseFloat(product.prc_prd),
                  quantity
                );

                return (
                  <li key={product.id}>
                    <table>
                      <tr>
                        <td rowSpan={2}>
                          <img src={product.img_prd} alt={product.nam_prd} />
                        </td>
                        <td width={300}>
                          <b className="nameProduct">{product.nam_prd}</b>
                        </td>
                        <td width={250}></td>
                        <td rowSpan={2}>
                          <b className="priceProduct">
                            ${productSubtotal.toFixed(2)}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Cantidad: {quantity}</td>
                      </tr>
                    </table>
                  </li>
                );
              })}
            </ul>
            <table className="total">
              <tr>
                <th className="subtotal">subtotal:</th>
                <td width={300}></td>
                <td>${subtotal}</td>
              </tr>
              <tr>
                <th>Total + 3% IVA:</th>
                <td width={300}></td>
                <td>${calculateTotal(subtotal).toFixed(2)}</td>
              </tr>
              <tr className="priceTotal">
                <th>Tatal a pagar:</th>
                <td width={300}></td>
                <td>${calculateTotal(subtotal).toFixed(2)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div className="box2">
        {checkoutStep === 1 ? (
          <form className="CheckoutForm" onSubmit={handleSubmit}>
            <h3>Ingresa tus datos:</h3>
            <div className="form-group">
              <label htmlFor="cedula">Cédula:</label>
              <input
                type="text"
                id="cedula"
                placeholder="V-"
                onChange={(e) => setCedula(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Dirección:</label>
              <input
                type="text"
                id="address"
                placeholder="Dirección"
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                value={sta_cli}
                onChange={(e) => handleEstadoChange(e.target.value)}
                required
              >
                <option value="">Seleccione un estado</option>
                {data.estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="city">Ciudad:</label>
              <select
                id="city"
                value={cit_cli}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="">Seleccione una ciudad</option>
                {data.ciudades[sta_cli] &&
                  data.ciudades[sta_cli].map((ciudad) => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Código postal:</label>
              <input
                type="text"
                id="zipCode"
                value={zip_cli}
                onChange={(e) => handleZipChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="pay-button"
                name="payWithCard"
              >
                Pagar con Tarjeta
              </button>
              <button
                type="submit"
                className="pay-button"
                name="payWithPaypal"
              >
                Pagar con Paypal
              </button>
            </div>
          </form>
        ) : checkoutStep === 2 ? (
          <form className="CheckoutForm" onSubmit={handleSubmitCard}>
            <h3>Ingresa los datos de tu tarjeta:</h3>
            <div className="form-group">
              <label htmlFor="cardNumber">Número de tarjeta:</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                onBlur={() => setCardError(validateCardNumber(cardNumber))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitCard(e);
                  }
                }}
                required
              />
              {cardError && <span className="error">{cardError}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="cardHolder">Titular de la tarjeta:</label>
              <input
                type="text"
                id="cardHolder"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
              />
            </div>
            <div className="form-group form-inline">
              <label htmlFor="expiryMonth">Fecha de vencimiento:</label>
              <select
                id="expiryMonth"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                required
              >
                <option value="">Mes</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option
                    key={month}
                    value={month.toString().padStart(2, '0')}
                  >
                    {month.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <div className="separator">/</div>
              <select
                id="expiryYear"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                required
              >
                <option value="">Año</option>
                {Array.from({ length: 10 }, (_, i) => currentYear + i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCVV(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="pay-button">
              Pagar con Tarjeta
            </button>
          </form>
        ) : (
          <div className="form-group PayPalButton">
            <PayPalButton
              options={{
                clientId: 'test',
                currency: 'USD',
              }}
              amount={calculateTotal(subtotal).toFixed(2)}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
              onCancel={() => console.log('Pago cancelado.')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;