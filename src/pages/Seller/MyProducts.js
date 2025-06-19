import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-center text-2xl font-bold text-[#800000] mb-6">My Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Image inside a maroon container to fill curved corners */}
            <div className="bg-[#800000]">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-b-2xl"
                />
              )}
            </div>
            {/* Details Section */}
            <div className="bg-[#800000] text-white p-4 flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
              <p className="font-bold mb-2">{product.price} LE</p>
              <p className="font-bold mb-2">Stock {product.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
