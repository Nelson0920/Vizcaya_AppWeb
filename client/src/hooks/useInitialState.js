import { useState } from "react";

const initialState ={
    cart: []
}

const useInitialState = () =>{
    const [state, setState] = useState(initialState)

    const addToCart = (payload) =>{
        // Verificar si el producto ya existe en el carrito
        const isProductInCart = state.cart.some((product) => product.id === payload.id);

        if (!isProductInCart) {
            setState({
                ...state,
                cart: [...state.cart, payload]
            });
        }
    }

    const removeFromCart = (indexValue) =>{
        setState({
            ...state,
            cart: state.cart.filter((product, index) => 
                index !== indexValue
            )
        })
    }

    return{
        state,
        addToCart,
        removeFromCart
    }
}

export default useInitialState
