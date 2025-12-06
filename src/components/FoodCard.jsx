import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Plus } from 'lucide-react';

const FoodCard = ({ food }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group">
            <div className="relative overflow-hidden h-48">
                <img
                    src={food.image_url || 'https://via.placeholder.com/300x200?text=Food+Image'}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {food.category}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={food.name}>{food.name}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-3">{food.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        ${Number(food.price).toFixed(2)}
                    </span>
                    <button
                        onClick={() => addToCart(food.id)}
                        className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-md hover:shadow-indigo-500/30 flex items-center justify-center"
                        title="Add to Cart"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
