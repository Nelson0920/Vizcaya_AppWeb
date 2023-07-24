import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderItem from '@components/OrderItem'
import AppContext from '@context/AppContext'
import '@styles/MyOrder.scss'
import iconOrder from "@icons/flechita.svg"

const MyOrder = () => {
  const navigate = useNavigate()
  const { state } = useContext(AppContext)
  const [toggleOrders, setToggleOrders] = useState(true)
  const [quantity, setQuantity] = useState({})

  const sumTotal = () => {
    const reducer = (counter, value) => counter + parseFloat(value.prc_prd) * quantity[value.id]
    const sum = state.cart.reduce(reducer, 0)
    return sum
  }

  const handleToggleOrders = () => {
    setToggleOrders(!toggleOrders)
  }

  const handleIncreaseQuantity = (productId) => {
    setQuantity(prevQuantity => ({
      ...prevQuantity,
      [productId]: (prevQuantity[productId] || 0) + 1
    }))
  }

  const handleDecreaseQuantity = (productId) => {
    if (quantity[productId] && quantity[productId] > 1) {
      setQuantity(prevQuantity => ({
        ...prevQuantity,
        [productId]: prevQuantity[productId] - 1
      }))
    }
  }

  const handleCheckout = () => {
    if (state.cart.length === 0) {
      console.log("Cart is empty. Cannot proceed to checkout.")
      return
    }

    const cartData = state.cart.map(product => {
      return {
        product: product,
        quantity: quantity[product.id] || 1,
        subtotal: sumTotal()
      }
    })

    // Aquí redirigimos a la ruta "/Checkout" y pasamos los datos del carrito como parámetro en la URL
    navigate('/Checkout', { state: { cartData } })
  }

  useEffect(() => {
    // Update quantity to 1 for new products
    const updatedQuantity = {}
    state.cart.forEach(product => {
      if (!quantity[product.id]) {
        updatedQuantity[product.id] = 1
      } else {
        updatedQuantity[product.id] = quantity[product.id]
      }
    })
    setQuantity(updatedQuantity)
  }, [state.cart])

  return (
    <>
      {toggleOrders && (
        <aside className="MyOrder">
          <div className="title-container">
            <img src={iconOrder} alt="arrow" className="imgExit" onClick={handleToggleOrders} />
            <p className="title">My order</p>
          </div>
          <div className="my-order-content">
            {state.cart.map((product, index) => (
              <div key={index}>
                <OrderItem product={product} indexValue={index} />
                <div className="quantity-control">
                  <button className="quantity-button" onClick={() => handleDecreaseQuantity(product.id)} disabled={quantity[product.id] && quantity[product.id] <= 1}>
                    ➖
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity[product.id] || 1}
                    max={product.qty_prd}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setQuantity(prevQuantity => ({
                        ...prevQuantity,
                        [product.id]: value
                      }))
                    }}
                    inputMode="none"
                  />
                  <button className="quantity-button" onClick={() => handleIncreaseQuantity(product.id)}>
                    ➕
                  </button>
                </div>
                <p>${(quantity[product.id] * product.prc_prd).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="order">
            <p>
              <span>Total</span>
            </p>
            <p>${sumTotal()}</p>
          </div>
          <button className="primary-button" onClick={handleCheckout}>
            Checkout
          </button>
        </aside>
      )}
    </>
  )
}

export default MyOrder
