import React, { useState, useEffect } from "react"; 
import { useDispatch } from "react-redux"; 
import { setProducts } from "../redux/productSlice"; // استدعاء الإجراء 
import ProductCard from "../components/ProductCard"; 
import { ToastContainer } from "react-toastify"; // ✅ أضفنا ToastContainer

const Shop = () => { 
  const [products, setProductsLocal] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const dispatch = useDispatch(); // استخدام dispatch 

  useEffect(() => { 
    const fetchProducts = async () => { 
      try { 
        const response = await fetch("https://fakestoreapi.com/products"); 
        const data = await response.json(); 
        setProductsLocal(data); // تحديث الحالة المحلية 
        dispatch(setProducts(data)); // إرسال البيانات إلى Redux 
      } catch (error) { 
        console.error("Error fetching products:", error); 
      } finally { 
        setLoading(false); 
      } 
    }; 

    fetchProducts(); 
  }, [dispatch]); 

  if (loading) { 
    return <div className="text-center py-12">Loading...</div>; 
  } 

  return ( 
    <div className="mx-auto py-12 px-4 md:px-16 lg:px-24">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop</h2>
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 cursor-pointer">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* ✅ أضفنا ToastContainer هنا */}
      <ToastContainer />
    </div>
  ); 
}; 

export default Shop;