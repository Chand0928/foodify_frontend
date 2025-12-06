import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        if (user) {
            try {
                const res = await axios.get('http://localhost:5001/api/cart');
                setCartItems(res.data);
            } catch (error) {
                console.error("Error fetching cart", error);
            }
        } else {
            setCartItems([]);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (foodId, quantity = 1) => {
        if (!user) {
            alert("Please login to add to cart");
            return;
        }
        try {
            await axios.post('http://localhost:5001/api/cart', { foodId, quantity });
            await fetchCart(); // Refresh cart
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axios.delete(`http://localhost:5001/api/cart/${cartItemId}`);
            await fetchCart();
        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete('http://localhost:5001/api/cart');
            setCartItems([]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
