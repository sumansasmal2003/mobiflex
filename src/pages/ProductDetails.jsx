import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'error'
  const [products, setProducts] = useState([])

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Enter expiry in MM/YY format';
    }

    if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Enter a valid CVV (3-4 digits)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!formData.address.trim() || formData.address.length < 10) {
      newErrors.address = 'Enter a valid address (min 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setPaymentStatus('processing');

    try {
      // Simulate API call to payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Random success (80% success rate)
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        setPaymentStatus('success');
        // Reset form after successful payment
        setTimeout(() => {
          setShowModal(false);
          setPaymentStatus(null);
          setFormData({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            name: '',
            email: '',
            address: ''
          });
        }, 3000);
      } else {
        throw new Error('Payment declined by bank');
      }
    } catch (error) {
      setPaymentStatus('error');
      console.error('Payment error:', error.message);
    }
  };

  // Close modal handler
  const closeModal = () => {
    if (paymentStatus !== 'processing') {
      setShowModal(false);
      setPaymentStatus(null);
      setErrors({});
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    if (showModal) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
      };

      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [showModal, paymentStatus]);


  useEffect(() => {
    const fetchProducts = () => {
      try {
        const productsRef = ref(database, 'products');
        onValue(productsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                  const productList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                  }));
                  setProducts(productList);
                  const foundProduct = products.find(item =>
          item.id.toString() === productId
        );
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          throw new Error('Product not found');
        }
                } else {
                  console.log('No products found in the database');
                }
              });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchProducts();
  }, [productId, products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 md:p-8">
      {product && (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-2/5 bg-gray-50 p-8 flex items-center justify-center">
            <div className="relative w-full h-80 md:h-96">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="md:w-3/5 p-8 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center mb-2">
                    <p className="ml-2 text-gray-600 font-semibold">{product.rating} <span className='text-xl text-green-500'>★</span></p>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600 mb-4">₹{product.price}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Details:</h3>
                <ul className="grid grid-cols-2 gap-1 text-gray-700">
                  {product.highlights?.map((detail, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span> {detail}
                    </li>
                  )) || <li>No additional details available</li>}
                </ul>
              </div>
            </div>
            <button className="flex-1 min-w-[200px] bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors cursor-pointer" onClick={() => setShowModal(true)}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      )}
      {/* Payment Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-6"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[40rem] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-indigo-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
                <p className="text-indigo-100">{product?.name}</p>
              </div>
              <img src={product?.image} alt="" className='w-20 rounded-md' />
            </div>

            {/* Payment Status Display */}
            {paymentStatus === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-6">Thank you for your purchase</p>
                <p className="text-lg font-semibold">₹{product?.price}</p>
              </div>
            ) : paymentStatus === 'error' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-6">Please try another payment method</p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              /* Payment Form */
              <form onSubmit={handlePayment} className="p-6">
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full p-3 border rounded-lg ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                      maxLength={16}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className={`w-full p-3 border rounded-lg ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className={`w-full p-3 border rounded-lg ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Billing Address */}
                  <div>
                    <label className="block text-gray-700 mb-2">Billing Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, City, Country"
                      rows="3"
                      className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    ></textarea>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={paymentStatus === 'processing'}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentStatus === 'processing'}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                      paymentStatus === 'processing'
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {paymentStatus === 'processing' ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      `Pay ₹${product?.price}`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
