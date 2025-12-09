import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Plus, Star } from 'lucide-react';

const FoodCard = ({ food }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="card-premium hover-lift group animate-fade-in">
            <div className="relative overflow-hidden h-56 rounded-t-2xl">
                <img
                    src={food.image_url || 'https://via.placeholder.com/400x300?text=Food+Image'}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                    <span className="glass px-4 py-2 text-indigo-600 text-xs font-bold rounded-full shadow-lg">
                        {food.category}
                    </span>
                </div>

                {/* Rating Badge (Optional - can be dynamic) */}
                <div className="absolute top-4 left-4 flex items-center gap-1 glass px-3 py-1.5 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-900">4.5</span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 truncate group-hover:text-gradient transition-all" title={food.name}>
                    {food.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2 leading-relaxed">
                    {food.description || 'Delicious food item prepared with fresh ingredients'}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Price</span>
                        <span className="text-3xl font-black text-gradient">
                            ${Number(food.price).toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={() => addToCart(food.id || food._id)}
                        className="btn-gradient flex items-center gap-2 px-5 py-3 hover-glow"
                        title="Add to Cart"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="font-bold">Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
