import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const { user } = useContext(AuthContext);

    const fetchOrders = async () => {
        try {
            const params = {
                page: currentPage,
                limit: 10,
                sortBy,
                order: sortOrder
            };
            if (statusFilter !== 'All') params.status = statusFilter;

            const res = await axios.get(`${API_URL}/api/orders`, { params });
            setOrders(res.data.orders || res.data);
            setPagination(res.data.pagination);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user, currentPage, statusFilter, sortBy, sortOrder]);

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        try {
            await axios.delete(`${API_URL}/api/orders/${orderId}`);
            alert('Order deleted successfully');
            fetchOrders(); // Refresh the list
        } catch (error) {
            console.error("Error deleting order", error);
            alert(error.response?.data?.message || 'Failed to delete order');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Ready': return 'bg-blue-100 text-blue-800';
            case 'Preparing': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <select
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <select
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                        setCurrentPage(1);
                    }}
                >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="total_amount-desc">Highest Amount</option>
                    <option value="total_amount-asc">Lowest Amount</option>
                </select>
            </div>

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id || order._id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Order #{order._id || order.id}</h3>
                                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                {(order.status === 'Pending' || order.status === 'Cancelled') && (
                                    <button
                                        onClick={() => handleDeleteOrder(order._id || order.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
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

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {[...Array(pagination.pages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 border rounded-md ${currentPage === index + 1
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pages}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {pagination && (
                <div className="mt-4 text-center text-gray-600">
                    Showing {orders.length} of {pagination.total} orders
                </div>
            )}
        </div>
    );
};

export default Orders;
