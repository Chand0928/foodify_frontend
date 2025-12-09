import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const Menu = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                let url = `${API_URL}/api/foods`;
                const params = {
                    page: currentPage,
                    limit: 12,
                    sortBy,
                    order: sortOrder
                };
                if (searchTerm) params.search = searchTerm;
                if (selectedCategory !== 'All') params.category = selectedCategory;

                const res = await axios.get(url, { params });
                setFoods(res.data.foods || res.data);
                setPagination(res.data.pagination);
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
    }, [searchTerm, selectedCategory, currentPage, sortBy, sortOrder]);

    const categories = ['All', 'Snacks', 'Meals', 'Drinks'];

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Menu</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search food..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <select
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
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
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {foods.map(food => (
                            <FoodCard key={food.id || food._id} food={food} />
                        ))}
                        {foods.length === 0 && (
                            <div className="col-span-full text-center text-gray-500">No food items found.</div>
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
                            Showing {foods.length} of {pagination.total} items
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Menu;
