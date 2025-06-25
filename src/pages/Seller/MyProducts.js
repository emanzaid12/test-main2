import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://shopyapi.runasp.net/api/Products";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const fetchProducts = async (endpoint = "my-products") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        const result = data.products || data;
        setProducts(result);
      } else {
       // alert(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error(err);
      //alert("An error occurred while fetching products.");
    }
    setLoading(false);
  };

  const fetchProductDetails = async (productId) => {
    setDetailsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setSelectedProduct(data);
        setShowDetails(true);
      } else {
        //alert(data.message || "Failed to fetch product details");
      }
    } catch (err) {
      console.error(err);
     // alert("An error occurred while fetching product details.");
    }
    setDetailsLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchProducts(); // Refresh
      } else {
        //alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the product.");
    }
  };

  const handleProductClick = (productId) => {
    fetchProductDetails(productId);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts(); // Default load
  }, []);

  const handleFilterChange = (value) => {
    setFilter(value);
    switch (value) {
      case "all":
        fetchProducts("my-products");
        break;
      case "out-of-stock":
        fetchProducts("out-of-stock");
        break;
      case "low-stock":
        fetchProducts("low-stock");
        break;
      case "sold":
        fetchProducts("sold-products");
        break;
      default:
        fetchProducts("my-products");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-center text-2xl font-bold text-[#800000] mb-6">
        My Products
      </h1>

      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {[
          { label: "All", value: "all" },
          { label: "Out of Stock", value: "out-of-stock" },
          { label: "Low Stock", value: "low-stock" },
          { label: "Sold Products", value: "sold" },
        ].map((btn) => (
          <button
            key={btn.value}
            className={`px-4 py-2 rounded-full font-medium ${
              filter === btn.value
                ? "bg-[#800000] text-white"
                : "bg-gray-200 text-[#800000] hover:bg-[#800000] hover:text-white transition"
            }`}
            onClick={() => handleFilterChange(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={() => handleProductClick(product.productId)}
            >
              <div className="bg-[#800000]">
                {product.imageUrls?.[0] && (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-b-2xl"
                  />
                )}
              </div>

              <div className="bg-[#800000] text-white p-4 flex flex-col items-center text-center">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="font-bold mb-1">{product.price} LE</p>
                <p className="font-bold mb-2">
                  Stock: {product.stockQuantity ?? product.currentStock}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/update-product/${product.productId}`);
                    }}
                    className="bg-white text-[#800000] font-bold px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.productId);
                    }}
                    className="bg-red-600 text-white font-bold px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#800000]">
                Product Details
              </h2>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {detailsLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Loading product details...</p>
              </div>
            ) : (
              <div className="p-6">
                {/* Product Images */}
                {selectedProduct.imageUrls &&
                  selectedProduct.imageUrls.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProduct.imageUrls.map((imageUrl, index) => (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Product Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#800000] mb-2">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">
                      {selectedProduct.price} LE
                    </p>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Stock Information
                      </h4>
                      <p className="text-gray-600">
                        <span className="font-medium">Available Stock:</span>{" "}
                        {selectedProduct.stockQuantity}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Category ID:</span>{" "}
                        {selectedProduct.categoryId}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Store ID:</span>{" "}
                        {selectedProduct.storeId}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Reviews
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500 text-xl">★</span>
                        <span className="font-medium text-gray-700">
                          {selectedProduct.averageRating}/5
                        </span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Total Reviews:</span>{" "}
                        {selectedProduct.totalReviews}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        closeDetails();
                        navigate(
                          `/update-product/${selectedProduct.productId}`
                        );
                      }}
                      className="bg-[#800000] text-white font-bold px-6 py-2 rounded hover:bg-[#600000] transition"
                    >
                      Update Product
                    </button>
                    <button
                      onClick={() => {
                        closeDetails();
                        handleDelete(selectedProduct.productId);
                      }}
                      className="bg-red-600 text-white font-bold px-6 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
