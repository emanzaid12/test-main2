import React, { useEffect } from 'react';
import { Categories, mockData } from '../assets/mockData';
import HeroImage from '../assets/images/hero-page.jpg';
import InfoSection from '../components/InfoSection'; 
import CategorySection from '../components/CategorySection';
import { setProducts } from '../redux/productSlice';
import { useDispatch, useSelector } from "react-redux";
import ProductCard from '../components/ProductCard';
import Shop from './Shop';

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product);

  useEffect(() => {
    dispatch(setProducts(mockData));
  }, [dispatch]);

  return (
    <div>
      <div className="bg-white mt-2 px-4 md:px-16 lg:px-24">
        {/* Hero Section */}
        <div className="container mx-auto py-4 flex flex-col md:flex-row space-x-0 md:space-x-4">
          <div className="relative w-full h-[500px] flex justify-center items-center">
            <img
              src={HeroImage}
              alt="Hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-1/4 left-10 px-4 md:px-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left">
                WELCOME TO SHOP
              </h2>
              <p className="text-xl md:text-2xl mt-2.5 font-bold text-gray-800 text-center md:text-left">
                MILLIONS+ PRODUCTS
              </p>
              <button
                className="bg-red-600 px-8 py-3 text-white mt-6 hover:bg-red-700 transform transition-transform duration-300 hover:scale-105 block mx-auto md:mx-0"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <InfoSection />

        {/* Category Section */}
        <CategorySection />

        {/* Top Products Section */}
        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Top Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.products?.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Shop Component */}
      <Shop />
    </div>
  );
};

export default Home;