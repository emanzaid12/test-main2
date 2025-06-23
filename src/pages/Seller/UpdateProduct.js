import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://shopyapi.runasp.net/api/Products";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const product = data.find((p) => p.productId.toString() === id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          stockQuantity: product.stockQuantity,
          categoryId: product.categoryId,
          images: [],
        });
        setPreviewImages(product.imageUrls || []);
      } else {
        alert("Product not found");
      }
    } catch (err) {
      alert("Error fetching product");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("Name", formData.name);
    submitData.append("Description", formData.description);
    submitData.append("Price", formData.price);
    submitData.append("StockQuantity", formData.stockQuantity);
    submitData.append("CategoryId", formData.categoryId);

    formData.images.forEach((image) => {
      submitData.append("Images", image);
    });

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Product updated");
        navigate("/dashboard/my-products");
      } else {
        alert(result.message || "Failed to update");
      }
    } catch (err) {
      alert("Error updating product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-[#800000] mb-6">
          Update Product
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#800000]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#800000]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Price (LE)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#800000]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#800000]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category ID
              </label>
              <input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#800000]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload New Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {previewImages.length > 0 && (
              <div>
                <p className="text-gray-700 font-medium mb-2">Image Preview</p>
                <div className="grid grid-cols-3 gap-3">
                  {previewImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="preview"
                      className="h-24 w-full object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-[#800000] text-white px-8 py-2 rounded-lg font-semibold hover:bg-[#600000] transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
