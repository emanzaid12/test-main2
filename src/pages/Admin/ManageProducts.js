import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Unblocked");

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("You are not logged in. Please login again.");
        return;
      }

      if (
        filterStatus === "All" ||
        filterStatus === "Blocked" ||
        filterStatus === "Unblocked"
      ) {
        try {
          let url = "";

          if (filterStatus === "All") {
            url = "https://shopyapi.runasp.net/api/Analytics/all";
          } else if (filterStatus === "Blocked") {
            url = "https://shopyapi.runasp.net/api/Analytics/blocked";
          } else if (filterStatus === "Unblocked") {
            url = "https://shopyapi.runasp.net/api/Analytics/unblocked";
          }

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          const formatted = data.map((p) => ({
            id: p.productId,
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stockQuantity,
            storeName: p.storeName || "-",
            seller: p.sellerName || p.storeName || "-",
            image: p.productImage,
            status: p.isBlocked ? "Blocked" : "Unblocked",
            sellerId: p.sellerId,
          }));
          setProducts(formatted);
        } catch (error) {
          console.error("Error fetching from API:", error);
          toast.error("Failed to load products. Please try again.", {
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            icon: false,
            closeButton: false,
            style: {
              color: "#7a0d0d",
              fontWeight: "bold",
              textAlign: "center",
            },
          });
        }
      }
    };

    fetchProducts();
  }, [filterStatus]);

  const toggleBlockStatus = async (productId) => {
    const token = localStorage.getItem("authToken");
    const product = products.find((p) => p.id === productId);
    const isBlocked = product.status === "Blocked";

    const url = isBlocked
      ? `https://shopyapi.runasp.net/api/ProductReports/unblock-product/${productId}`
      : `https://shopyapi.runasp.net/api/ProductReports/block-product/${productId}`;

    const method = isBlocked ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      const updatedProducts = products.map((p) => {
        if (p.id === productId) {
          const newStatus = isBlocked ? "Unblocked" : "Blocked";
          return { ...p, status: newStatus };
        }
        return p;
      });

      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      toast.success(
        `Product has been ${isBlocked ? "unblocked" : "blocked"}.`,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          icon: false,
          closeButton: false,
          style: {
            color: "#7a0d0d",
            fontWeight: "bold",
            textAlign: "center",
          },
        }
      );
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Error updating product status.", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        icon: false,
        closeButton: false,
        style: {
          color: "#7a0d0d",
          fontWeight: "bold",
          textAlign: "center",
        },
      });
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("authToken");
    const product = products.find((p) => p.id === productId);
    const sellerId = product?.sellerId;

    if (!sellerId) {
      toast.error("Missing seller ID for this product.");
      return;
    }

    try {
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Products/${productId}?sellerId=${sellerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }

      const updatedProducts = products.filter((p) => p.id !== productId);
      setProducts(updatedProducts);

      toast.success("Product is deleted successfully", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        icon: false,
        closeButton: false,
        style: {
          color: "#7a0d0d",
          fontWeight: "bold",
          textAlign: "center",
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product.", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        icon: false,
        closeButton: false,
        style: {
          color: "#7a0d0d",
          fontWeight: "bold",
          textAlign: "center",
        },
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const productStatus = (product.status || "Unblocked")
      .trim()
      .toLowerCase();
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

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded">
        <input
          type="text"
          placeholder="Search by product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 
             focus:outline-none focus:ring-0 focus:ring-offset-0 
             focus:border-[#7a0d0d] focus:shadow-none appearance-none"
          style={{ boxShadow: "none" }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
        >
          <option value="All">All</option>
          <option value="Unblocked">Unblocked</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100 text-[#7a0d0d] text-sm font-semibold">
              <th className="px-4 py-3 border">Seller ID</th>
              <th className="px-4 py-3 border">Product_ID</th>
              <th className="px-4 py-3 border">Product_Image</th>
              <th className="px-4 py-3 border">Product_Name</th>
              <th className="px-4 py-3 border">Product_Category</th>
              <th className="px-4 py-3 border">Product_Price</th>
              <th className="px-4 py-3 border">Stock</th>
              <th className="px-4 py-3 border">Store Name</th>
              <th className="px-4 py-3 border">Seller</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="text-sm text-gray-700">
                <td className="px-4 py-3 border align-middle">
                  {product.sellerId || "-"}
                </td>
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
                <td className="px-4 py-3 border align-middle">${product.price}</td>
                <td className="px-4 py-3 border align-middle">{product.stock}</td>
                <td className="px-4 py-3 border align-middle">
                  {product.storeName || "-"}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {product.seller || "-"}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {product.status}
                </td>
                <td className="px-4 py-3 border align-middle">
  <div className="flex justify-center gap-2">
    <button
      onClick={() => toggleBlockStatus(product.id)}
      className="bg-[#7a0d0d] text-white text-sm px-3 py-1 rounded-full hover:bg-red-900"
    >
      {product.status === "Blocked" ? "Unblock" : "Block"}
    </button>
    <button
      onClick={() => handleDelete(product.id)}
      className="bg-[#7a0d0d] text-white text-sm px-3 py-1 rounded-full hover:bg-red-900"
    >
      Delete
    </button>
  </div>
</td>

              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="11" className="px-4 py-6 text-gray-500 text-center text-sm">
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