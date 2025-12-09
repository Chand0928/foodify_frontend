import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, fetchCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [placingOrder, setPlacingOrder] = useState(false);

    const total = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setPlacingOrder(true);
        try {
            const items = cartItems.map(item => ({
                food_id: item.food_id,
                quantity: item.quantity,
                price: item.price
            }));

            const res = await axios.post(`${API_URL}/api/orders`, {
                items,
                totalAmount: total
            });

            if (res.status === 201) {
                await clearCart();
                // We'll trust the alerts for now, but in a real app better UI feedback is needed
                alert('Order placed successfully!');
                navigate('/orders');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-16 bg-gray-50 px-4">
                <div className="text-center">
                    <div className="bg-indigo-100 rounded-full p-6 inline-flex mb-6">
                        <ArrowRight className="h-10 w-10 text-indigo-600 opacity-50" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our delicious menu to find something you like!</p>
                    <Link to="/menu" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-1">
                        Browse Menu <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {cartItems.map((item) => (
                            <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                                    <img
                                        className="h-20 w-20 object-cover rounded-xl shadow-sm"
                                        src={item.image_url || 'https://via.placeholder.com/100'}
                                        alt={item.name}
                                    />
                                    <div className="ml-6">
                                        <div className="text-lg font-bold text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">${Number(item.price).toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={async () => {
                                                const newQty = item.quantity - 1;
                                                if (newQty < 1) {
                                                    removeFromCart(item.id);
                                                } else {
                                                    try {
                                                        await axios.put(`${API_URL}/api/cart/${item.id}`, {
                                                            quantity: newQty
                                                        });
                                                        fetchCart();
                                                    } catch (error) {
                                                        console.error('Error updating quantity', error);
                                                    }
                                                }
                                            }}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 text-gray-900 font-medium">{item.quantity}</span>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await axios.put(`${API_URL}/api/cart/${item.id}`, {
                                                        quantity: item.quantity + 1
                                                    });
                                                    fetchCart();
                                                } catch (error) {
                                                    console.error('Error updating quantity', error);
                                                }
                                            }}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <span className="text-xl font-bold text-indigo-600 min-w-[80px] text-right">
                                        ${(Number(item.price) * item.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"
                                        title="Remove item"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="p-6 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-2xl font-bold text-gray-900">
                            Total: <span className="text-indigo-600">${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={placingOrder}
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {placingOrder ? 'Processing...' : 'Checkout Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
