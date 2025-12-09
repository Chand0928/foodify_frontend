import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_URL } from '../config';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchCart = async () => {
        if (user) {
            try {
                const res = await axios.get(`${API_URL}/api/cart`);
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
            alert('Please login to add items to cart');
            return;
        }

        try {
            await axios.post(`${API_URL}/api/cart`, { foodId, quantity });
            fetchCart();
            alert('Item added to cart');
        } catch (error) {
            console.error("Error adding to cart", error);
            alert('Failed to add item to cart');
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axios.delete(`${API_URL}/api/cart/${cartItemId}`);
            fetchCart();
            alert('Failed to remove item');
        } catch (error) {
            console.error("Error removing from cart", error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`${API_URL}/api/cart`);
            setCartItems([]);
        } catch (error) {
            console.error("Error clearing cart", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
