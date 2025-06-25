import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { ref, push } from 'firebase/database';
import { database } from '../firebase'; // Make sure to create this firebase config file

const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    rating: '',
    description: '',
    link: '',
  });

  const [inputFields, setInputFields] = useState([{ value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Prepare the product data
      const productData = {
        ...formData,
        highlights: inputFields.map(field => field.value).filter(val => val.trim() !== ''),
        createdAt: new Date().toISOString(),
      };

      // Convert rating to number
      if (productData.rating) {
        productData.rating = parseFloat(productData.rating);
      }

      // Push to Firebase Realtime Database
      const productsRef = ref(database, 'products');
      await push(productsRef, productData);

      // Reset form and show success
      setFormData({
        name: '',
        image: '',
        price: '',
        rating: '',
        description: '',
        link: '',
      });
      setInputFields([{ value: "" }]);
      setSuccessMessage('Product uploaded successfully!');
    } catch (error) {
      console.error('Error uploading product:', error);
      setErrorMessage('Failed to upload product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-3xl flex flex-col'>
        <h2 className='text-lg mb-4 text-center text-indigo-500 font-semibold'>
          Upload New Product
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name" className='text-md font-semibold text-green-600'>
              Product's Name:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className='bg-gray-100 w-full h-10 rounded shadow-inner outline-none border-none p-4'
              placeholder='Enter the product name'
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="image" className='text-md font-semibold text-green-600'>
              Product's Image URL:
            </label>
            <input
              type="url"
              id="image"
              value={formData.image}
              onChange={handleChange}
              className='bg-gray-100 w-full h-10 rounded shadow-inner outline-none border-none p-4'
              placeholder='Enter the product Image URL'
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="price" className='text-md font-semibold text-green-600'>
                Price:
              </label>
              <input
                type="text"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className='bg-gray-100 w-full h-10 rounded shadow-inner outline-none border-none p-4'
                placeholder='Enter the price of the product'
                required
              />
            </div>
            <div>
              <label htmlFor="rating" className='text-md font-semibold text-green-600'>
                Rating:
              </label>
              <input
                type="text"
                id="rating"
                value={formData.rating}
                onChange={handleChange}
                className='bg-gray-100 w-full h-10 rounded shadow-inner outline-none border-none p-4'
                placeholder='Enter the rating (1-5)'
                required
              />
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="description" className='text-md font-semibold text-green-600'>
              Product's description:
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className='bg-gray-100 w-full rounded shadow-inner outline-none border-none p-4'
              placeholder='Enter the product Description'
              required
              rows="4"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="link" className='text-md font-semibold text-green-600'>
              Product's link (Flipkart):
            </label>
            <input
              type="url"
              id="link"
              value={formData.link}
              onChange={handleChange}
              className='bg-gray-100 w-full h-10 rounded shadow-inner outline-none border-none p-4'
              placeholder='Enter the product Link'
              required
            />
          </div>

          {inputFields.map((inputField, index) => (
            <div key={index} className='flex gap-1'>
              <div className='flex flex-col w-full'>
                <label htmlFor={`feature-${index}`} className='text-md font-semibold text-green-600'>
                  Feature {index + 1}:
                </label>
                <input
                  type="text"
                  id={`feature-${index}`}
                  value={inputField.value}
                  onChange={(e) => {
                    const newFields = [...inputFields];
                    newFields[index].value = e.target.value;
                    setInputFields(newFields);
                  }}
                  className='bg-gray-100 w-full h-10 rounded shadow-inner outline-none border-none p-4'
                  placeholder={`Enter feature ${index + 1}`}
                />
              </div>
              <div className='flex items-center justify-center mt-6 gap-2'>
                <button
                  type="button"
                  onClick={() => {
                    setInputFields([...inputFields, { value: "" }]);
                  }}
                  className={`bg-blue-500 text-white rounded h-10 w-fit p-2 cursor-pointer`}
                >
                  <FaPlus />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (inputFields.length > 1) {
                      const newFields = inputFields.filter((_, i) => i !== index);
                      setInputFields(newFields);
                    }
                  }}
                  className={`bg-red-500 text-white rounded h-10 w-fit p-2 cursor-pointer ${
                    inputFields.length === 1 ? 'hidden' : ''
                  }`}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center bg-indigo-500 text-white h-10 w-20 shadow-xl rounded cursor-pointer hover:bg-indigo-600 transition-colors duration-300 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
