import React from 'react'
import { FaCartPlus } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ id, name, price, description, rating, image }) => {
  const navigate = useNavigate()
  return (
    <div
      className='flex md:flex-row flex-col items-cente gap-6 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-30 w-full max-w-7xl'
      key={id}
    >
      <div className='flex flex-col items-center justify-center w-full md:max-w-xs'>
        <img src={image} alt={name} className='w-64 h-fit mb-4 rounded-md cursor-pointer' onClick={() => navigate(`/product/${id}`)} />
        <button className='flex items-center justify-center gap-3 mt-4 bg-blue-600 text-white w-full md:max-w-[16rem] h-10 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer inter-600' onClick={() => navigate(`/product/${id}`)}>
          <FaCartPlus />
          <p>Buy Now</p>
        </button>
      </div>
      <div className='flex flex-col w-full'>
        <h2 className='text-lg font-semibold mb-2 text-zinc-700 hover:text-black cursor-pointer inter-700' onClick={() => navigate(`/product/${id}`)}>{name}</h2>
        <p className='text-gray-600 mb-2 w-full hidden md:block h-full mt-3 inter-300'>{description}</p>
        <div className='flex items-center justify-between w-full mb-2'>
          <span className='text-xl font-bold text-rose-500 inter-700'>₹{price}</span>
          <span className='text-slate-600 inter-700'>{rating} <span className='text-amber-400 text-lg'>★</span></span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
