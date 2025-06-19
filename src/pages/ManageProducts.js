import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending"); // ✅ الديفولت Pending

  // Load products on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);

      // تأكد ان كل برودكت عنده status مبدأي لو مفيش
      const updatedProducts = parsedProducts.map((product) => ({
        ...product,
        status: product.status ? product.status : "Pending",
      }));

      setProducts(updatedProducts);
    }
  }, []);

  const handleApprove = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, status: "Approved" } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    toast.success("Product approved successfully", {
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  icon: false,
  style: {
    color: "#7a0d0d",
    fontWeight: "bold",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
});

    
  };

  const handleReject = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, status: "Rejected" } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    toast.success("Product rejected. Notification sent to seller", {
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  icon: false,
  style: {
    color: "#7a0d0d",
    fontWeight: "bold",
    textAlign: "center",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    width: "fit-content",
    margin: "auto",
    padding: "0.5rem 1rem",
  },
});

  };

  // فلترة المنتجات حسب الستاتس و حسب البحث
  const filteredProducts = products.filter((product) => {
    const productStatus = (product.status || "Pending").trim().toLowerCase();
    const selectedFilter = filterStatus.trim().toLowerCase();

    const matchesStatus =
      selectedFilter === "all" ? true : productStatus === selectedFilter;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center text-[#7a0d0d] mb-6">
        Manage Products
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded">
      <input
  type="text"
  placeholder="Search by product"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 
             focus:outline-none focus:ring-0 focus:ring-offset-0 
             focus:border-[#7a0d0d] focus:shadow-none appearance-none"
  style={{ boxShadow: 'none' }}
/>


<select
  value={filterStatus}
  onChange={(e) => setFilterStatus(e.target.value)}
  className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
>

          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100 text-[#7a0d0d] text-sm font-semibold">
              <th className="px-4 py-3 border">Product_ID</th>
              <th className="px-4 py-3 border">Product_Image</th>
              <th className="px-4 py-3 border">Product_Name</th>
              <th className="px-4 py-3 border">Product_Category</th>
              <th className="px-4 py-3 border">Product_Price</th>
              <th className="px-4 py-3 border">Stock</th>
              <th className="px-4 py-3 border">Seller</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="text-sm text-gray-700">
                <td className="px-4 py-3 border align-middle">
                  P{String(product.id).padStart(3, "0")}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded mx-auto"
                    />
                  )}
                </td>
                <td className="px-4 py-3 border align-middle">{product.name}</td>
                <td className="px-4 py-3 border align-middle">
                  {product.category || "-"}
                </td>
                <td className="px-4 py-3 border align-middle">
                  ${product.price}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {product.stock}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {product.seller || "-"}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {product.status}
                </td>
                <td className="px-4 py-3 border align-middle space-x-2">
                  <button
                    onClick={() => handleApprove(product.id)}
                    className="bg-[#7a0d0d] text-white text-sm px-2 py-1 rounded-full hover:bg-red-800"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(product.id)}
                    className="bg-[#7a0d0d] text-white text-sm px-2 py-1 rounded-full hover:bg-red-800"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="px-4 py-6 text-gray-500 text-center text-sm"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
