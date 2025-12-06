import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/orders');
                setOrders(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Ready': return 'bg-blue-100 text-blue-800';
            case 'Preparing': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                            <div className="text-base font-medium text-gray-900">Total Amount</div>
                            <div className="text-xl font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</div>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center text-gray-500">You haven't placed any orders yet.</div>
                )}
            </div>
        </div>
    );
};

export default Orders;
