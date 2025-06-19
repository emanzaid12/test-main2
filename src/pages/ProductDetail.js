import React, { useEffect, useState } from "react"; 
import { useDispatch } from "react-redux"; 
import { setProducts } from "../redux/productSlice"; 
import { useParams } from "react-router-dom"; 
import { FaCarSide, FaQuestion } from "react-icons/fa"; 
 
const ProductDetail = () => { 
  const { id } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const dispatch = useDispatch();
 
  useEffect(() => { 
    const fetchProduct = async () => { 
      try { 
        const response = await fetch(`https://fakestoreapi.com/products/${id}`); 
        const data = await response.json(); 
        setProduct(data); 
        dispatch(setProducts([data]));
      } catch (error) { 
        console.error("Error fetching product:", error); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    fetchProduct(); 
  }, [id, dispatch]); 
 
  if (loading) return <div>Loading...</div>; 
 
  if (!product) return <div>Product not found!</div>; 
 
  return ( 
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24"> 
      <div className="flex flex-col md:flex-row gap-x-16"> 
        <div className="md:w-1/2 py-4 shadow-md md:px-8 h-96 flex justify-center"> 
          <img src={product.image} alt={product.title} className="h-full" /> 
        </div> 
        <div className="md:w-1/2 p-4 shadow-md md:p-16 flex flex-col items-center gap-y-2"> 
          <h2 className="text-3xl font-semibold mb-2">{product.title}</h2> 
          <p className="text-xl font-semibold text-gray-800 mb-4"> 
            ${product.price} 
          </p> 
          <div className="flex items-center mb-4 gap-x-2"> 
            <input 
              id="quantity" 
              type="number" 
              min="1" 
              className="borde p-1 w-16" 
            /> 
            <button className="bg-red-600 text-white py-1.5 px-4 hover:bg-red-800"> 
              Add to Cart 
            </button> 
          </div> 
          <div className="flex flex-col gap-y-4 mt-4"> 
            <p className="flex items-center"> 
              <FaCarSide className="mr-1" /> 
              Delivery & Return 
            </p> 
            <p className="flex items-center"> 
              <FaQuestion className="mr-1" /> 
              Ask a Question 
            </p> 
          </div> 
        </div> 
      </div> 
      <div className="mt-8"> 
        <h3 className="text-xl font-bold mb-2">Product Description</h3> 
        <p>{product.description}</p> 
      </div> 
    </div> 
  ); 
}; 
 
export default ProductDetail;