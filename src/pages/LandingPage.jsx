import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const LandingPage = () => {

  const [products, setproducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const fetchProducts = () => {
      const productsRef = ref(database, 'products');
      onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setproducts(productList);
          setAllProducts(productList); // Store all products for filtering
        } else {
          console.log('No products found in the database');
        }
      });
    };

    fetchProducts();
  }, []);  // empty deps ⇒ run once on mount

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setProductName(searchTerm);

    if (searchTerm === '') {
      setproducts(allProducts); // Show all products if input is cleared
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)
      );
      if (filtered.length === 0) {
        console.log('No products found for:', searchTerm);
      }
      setproducts(filtered);
    }
  };

  return (
    <div
      className='flex flex-col items-center gap-4 min-h-screen bg-gray-100 p-6'
    >
      <input type="text" className='w-full max-w-lg h-10 border-none outline-none bg-white p-5 shadow-xl rounded' placeholder='search your product' onChange={handleSearch} value={productName} />
      <div
        className='w-full p-6 flex flex-col items-center justify-center gap-6'
      >
        {products.length === 0 && (
          <div className='flex items-center justify-center h-64'>
            <p className='text-gray-500 text-lg'>No products found</p>
          </div>
          )}
        {products.map((product) => (
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            rating={product.rating}
            image={product.image}
            key={product.id}
            color={product.color}
            link={product.link}
          />
        ))}
      </div>
    </div>
  )
}

export default LandingPage
