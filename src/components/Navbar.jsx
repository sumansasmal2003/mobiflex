import React from 'react'
import mobiflex from '../assets/mobiflex.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div
      className='flex items-center justify-between shadow-md sticky z-50 top-0 w-full inter-500 bg-indigo-100'
    >
      <Link to="/" className='flex items-center'>
        <img src={mobiflex} alt="mobiflex" className='w-20 rounded-xl cursor-pointer' />
        <h3 className='font-semibold text-xl text-indigo-500'>MobiFlex</h3>
      </Link>
    </div>
  )
}

export default Navbar
