import React from 'react';
import { FaCartPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import flipkart from '../assets/flipkart.png';

const ProductCard = ({ id, name, price, description, rating, image, link }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col md:flex-row gap-6 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-full max-w-7xl"
      key={id}
    >
      {/* Product Image */}
      <div
        className="flex items-center justify-center cursor-pointer group"
        onClick={() => navigate(`/product/${id}/${name}`)}
      >
        <img
          src={image}
          alt={name}
          className="w-48 h-48 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <h2
          className="text-xl font-medium text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate(`/product/${id}/${name}`)}
        >
          {name}
        </h2>

        <p className="text-gray-500 text-sm mb-4 line-clamp-3 hidden md:block">
          {description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-blue-700">₹{price}</span>
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 px-2 py-1 rounded-full text-sm font-medium text-blue-800 shadow-lg">
                {rating} ★
              </div>
              <img
                src={flipkart}
                alt="Flipkart"
                className="w-7 h-7 rounded-full border border-blue-200 cursor-pointer hover:scale-110 transition-transform shadow-lg"
                onClick={() => window.location.href = link}
              />
            </div>
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full md:max-w-[10rem] py-2.5 rounded-lg font-medium transition-colors duration-300 cursor-pointer"
            onClick={() => navigate(`/product/${id}/${name}`)}
          >
            <FaCartPlus className="text-lg" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
