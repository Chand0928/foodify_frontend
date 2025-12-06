import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import { AuthContext } from '../context/AuthContext';

const Menu = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                let url = 'http://localhost:5001/api/foods';
                const params = {};
                if (searchTerm) params.search = searchTerm;
                if (selectedCategory !== 'All') params.category = selectedCategory;

                const res = await axios.get(url, { params });
                setFoods(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching foods", error);
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchFoods();
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, selectedCategory]);

    const categories = ['All', 'Snacks', 'Meals', 'Drinks'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Menu</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search food..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foods.map(food => (
                        <FoodCard key={food.id} food={food} />
                    ))}
                    {foods.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">No food items found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;
