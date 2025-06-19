import { useState, useRef, useEffect } from "react";
import {
  FaPlus,
  FaChevronDown,
  FaBoxOpen,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddYourProducts = () => {
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isAllProductsOpen, setIsAllProductsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ تحميل المنتجات من localStorage عند التهيئة
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [editIndex, setEditIndex] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef();
  const navigate = useNavigate();

  const batchOptions = ["Delete Selected", "Publish Selected", "Unpublish Selected"];
  const allProductsOptions = ["All Products", "Active Products", "Inactive Products", "Out of Stock", "On Sale"];

  // ✅ حفظ المنتجات عند التعديل
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // ✅ قفل scroll لما المودال يفتح
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showForm]);

  // ✅ قفل form لو ضغطت برة
  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setShowForm(false);
      setFormErrors({});
      setEditIndex(null);
      setFormData({ name: "", price: "", stock: "" });
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  useEffect(() => {
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm]);

  // ✅ قفل الـ dropdown لما تضغطي برة
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest(".batch-dropdown")) setIsBatchOpen(false);
      if (!e.target.closest(".all-products-dropdown")) setIsAllProductsOpen(false);
    };
    document.addEventListener("mousedown", closeDropdowns);
    return () => document.removeEventListener("mousedown", closeDropdowns);
  }, []);

  const handleSave = () => {
  localStorage.setItem("products", JSON.stringify(products));  // حفظ مؤكد
  navigate("/dashboard/my-products");
};


  const handleAddProduct = () => {
    const errors = {};
    if (!formData.name) errors.name = "Product name is required.";
    if (!formData.price) errors.price = "Price is required.";
    if (!formData.stock) errors.stock = "Stock is required.";
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const product = {
      id: editIndex !== null ? products[editIndex].id : products.length + 1,
      name: formData.name,
      price: Number(formData.price), // نحوله رقم
      stock: Number(formData.stock), // نحوله رقم
      image: imagePreview,
      sale: "No",
    };

    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = product;
      setProducts(updated);
    } else {
      setProducts([...products, product]);
    }

    setFormData({ name: "", price: "", stock: "" });
    setSelectedImage(null);
    setImagePreview(null);
    setShowForm(false);
    setEditIndex(null);
    setFormErrors({});
  };

  const handleEdit = (index) => {
    const product = products[index];
    setFormData({ name: product.name, price: product.price.toString(), stock: product.stock.toString() });
    setImagePreview(product.image);
    setSelectedImage(product.image);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated.map((p, i) => ({ ...p, id: i + 1 })));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === "price" || name === "stock") && value !== "") {
      const numericValue = value.replace(/\D/, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header Section */}
      <div className="bg-[#800000] p-6 rounded-b-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Add Your Products</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowForm(true);
                setEditIndex(null);
              }}
              className="flex items-center gap-2 bg-white border border-[#800000] text-[#800000] font-semibold px-4 py-2 rounded-full hover:scale-105 transition-transform"
            >
              <FaPlus /> Add New Product
            </button>

            <div className="relative batch-dropdown">
              <button
                onClick={() => setIsBatchOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-white border border-[#800000] text-[#800000] font-semibold px-4 py-2 rounded-full"
              >
                Batch <FaChevronDown />
              </button>
              {isBatchOpen && (
                <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded shadow-md w-48 z-10">
                  {batchOptions.map((option, index) => (
                    <div key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700">
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative all-products-dropdown">
              <button
                onClick={() => setIsAllProductsOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-white border border-[#800000] text-[#800000] font-semibold px-4 py-2 rounded-full"
              >
                All Products <FaChevronDown />
              </button>
              {isAllProductsOpen && (
                <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded shadow-md w-48 z-10">
                  {allProductsOptions.map((option, index) => (
                    <div key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700">
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 p-4 text-gray-500 font-semibold text-sm">
        <div className="text-center">PID</div>
        <div className="text-center">IMAGE</div>
        <div className="text-center">PRODUCT NAME</div>
        <div className="text-center">PRICE</div>
        <div className="text-center">STOCK</div>
        <div className="text-center">SALE</div>
        <div className="text-center">ACTION</div>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] px-4">
          <FaBoxOpen className="text-[#800000] text-6xl mb-4" />
          <p className="text-[#800000] font-semibold text-lg mb-2">No products have been added yet.</p>
          <p className="text-gray-500 text-sm">Once you add products, they will appear here.</p>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {products.map((product, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 items-center text-center border-b py-2">
              <div>{product.id}</div>
              <div>
                {product.image && <img src={product.image} alt="preview" className="w-10 h-10 object-cover mx-auto rounded" />}
              </div>
              <div>{product.name}</div>
              <div>{product.price}</div>
              <div>{product.stock}</div>
              <div>{product.sale}</div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="flex items-center gap-1 bg-[#800000] text-white px-3 py-1 text-sm rounded-full hover:scale-105 transition"
                >
                  <FaEdit className="text-white" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-white border border-[#800000] text-[#800000] p-2 rounded-full hover:scale-105 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      {products.length > 0 && (
        <div className="flex justify-center mt-8 mb-6">
          <button
            className="px-6 py-2 bg-[#800000] text-white rounded-full font-semibold text-sm hover:bg-[#a33] hover:scale-105 transition-all"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={formRef} className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-[#800000] text-white py-3 text-lg font-semibold text-center">
              {editIndex !== null ? "Edit Product" : "Add New Product"}
            </div>

            <div className="p-6">
              {/* Image Upload */}
              <div className="mb-4">
                <p className="font-medium mb-1">Image</p>
                <div className="flex items-center gap-2">
                  {imagePreview && (
                    <img src={imagePreview} className="w-12 h-12 object-cover border rounded" alt="Preview" />
                  )}
                  <label className="w-12 h-12 border border-dashed rounded flex items-center justify-center cursor-pointer text-gray-400 hover:border-[#800000]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result);
                            setSelectedImage(file);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <FiPlus />
                  </label>
                </div>
              </div>

              {/* Product Name */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#800000] ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#800000] ${
                    formErrors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
              </div>

              {/* Stock */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Stock</label>
                <input
                  type="text"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#800000] ${
                    formErrors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.stock && <p className="text-red-500 text-sm">{formErrors.stock}</p>}
              </div>

              {/* Save Product Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleAddProduct}
                  className="mt-6 px-5 py-2 bg-[#800000] text-white rounded-full text-sm font-semibold hover:bg-[#a33] hover:scale-105 transition-all"
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddYourProducts;
