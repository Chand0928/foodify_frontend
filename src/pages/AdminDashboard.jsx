import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]); // In a real app, separate page
    const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image_url: '', category: '' });
    const [editingFood, setEditingFood] = useState(null);

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/foods');
            setFoods(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateFood = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/foods', newFood);
            setNewFood({ name: '', description: '', price: '', image_url: '', category: '' });
            fetchFoods();
        } catch (error) {
            console.error(error);
            alert('Failed to create food');
        }
    };

    const handleDeleteFood = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5001/api/foods/${id}`);
                fetchFoods();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Basic layout
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Food Form */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Add New Food Item</h2>
                    <form onSubmit={handleCreateFood} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-2 border rounded"
                            value={newFood.name}
                            onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            value={newFood.description}
                            onChange={e => setNewFood({ ...newFood, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="w-full p-2 border rounded"
                            value={newFood.price}
                            onChange={e => setNewFood({ ...newFood, price: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            className="w-full p-2 border rounded"
                            value={newFood.image_url}
                            onChange={e => setNewFood({ ...newFood, image_url: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            className="w-full p-2 border rounded"
                            value={newFood.category}
                            onChange={e => setNewFood({ ...newFood, category: e.target.value })}
                            required
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Add Item
                        </button>
                    </form>
                </div>

                {/* Food List */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Manage Foods</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {foods.map(food => (
                            <div key={food.id} className="flex justify-between items-center p-2 border-b">
                                <div>
                                    <h3 className="font-semibold">{food.name}</h3>
                                    <p className="text-sm text-gray-500">${Number(food.price).toFixed(2)}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleDeleteFood(food.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
