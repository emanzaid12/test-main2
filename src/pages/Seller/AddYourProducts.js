import { useState, useRef, useEffect } from "react";
import {
  FaPlus,
  FaChevronDown,
  FaBoxOpen,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

const AddYourProducts = () => {
  const [isAllProductsOpen, setIsAllProductsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    productId: null,
    productName: "",
  });

  const formRef = useRef();

  const allProductsOptions = [
    "All Products",
    "Out of Stock",
    "Low Stock",
    "Sold Products",
  ];

  // جلب المنتجات والفئات عند تحميل الصفحة
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // دالة جلب الفئات
  const fetchCategories = async () => {
    setFetchingCategories(true);
    try {
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Category/categories"
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        // تعيين أول فئة كافتراضية إذا كانت متوفرة
        if (data.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setFetchingCategories(false);
    }
  };

  // دالة جلب المنتجات
  const fetchProducts = async () => {
    setFetchingProducts(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Products/my-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setFetchingProducts(false);
    }
  };

  // دالة التعامل مع خيارات المنتجات
  const handleProductsFilter = async (option) => {
    setFetchingProducts(true);
    try {
      const token = localStorage.getItem("authToken");
      let url = "https://shopyapi.runasp.net/api/Products/my-products";

      switch (option) {
        case "Out of Stock":
          url = "https://shopyapi.runasp.net/api/Products/out-of-stock";
          break;
        case "Low Stock":
          url = "https://shopyapi.runasp.net/api/Products/low-stock";
          break;
        case "Sold Products":
          url = "https://shopyapi.runasp.net/api/Products/sold-products";
          break;
        default:
          url = "https://shopyapi.runasp.net/api/Products/my-products";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (option === "Sold Products") {
          setProducts(data.products || []);
        } else if (option === "Out of Stock" || option === "Low Stock") {
          setProducts(data.products || []);
        } else {
          setProducts(data);
        }
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setFetchingProducts(false);
      setIsAllProductsOpen(false);
    }
  };

  // قفل scroll لما المودال يفتح
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showForm]);

  // قفل form لو ضغطت برة
  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setShowForm(false);
      setFormErrors({});
      setEditIndex(null);
      setFormData({
        name: "",
        price: "",
        stock: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
      });
      setSelectedImages([]);
      setImagePreviews([]);
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

  // قفل الـ dropdown لما تضغطي برة
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest(".all-products-dropdown"))
        setIsAllProductsOpen(false);
    };
    document.addEventListener("mousedown", closeDropdowns);
    return () => document.removeEventListener("mousedown", closeDropdowns);
  }, []);

  // دالة إضافة/تحديث المنتج
  const handleAddProduct = async () => {
    const errors = {};
    if (!formData.name) errors.name = "Product name is required.";
    if (!formData.price) errors.price = "Price is required.";
    if (!formData.stock) errors.stock = "Stock is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (!formData.categoryId) errors.categoryId = "Category is required.";
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formDataToSend = new FormData();

      formDataToSend.append("Name", formData.name);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Price", formData.price);
      formDataToSend.append("StockQuantity", formData.stock);
      formDataToSend.append("CategoryId", formData.categoryId);

      // إضافة الصور
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`Images`, image);
      });

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Products/add-product",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        // إعادة جلب المنتجات
        await fetchProducts();

        // إعادة تعيين النموذج
        setFormData({
          name: "",
          price: "",
          stock: "",
          description: "",
          categoryId: categories.length > 0 ? categories[0].id : "",
        });
        setSelectedImages([]);
        setImagePreviews([]);
        setShowForm(false);
        setEditIndex(null);
        setFormErrors({});

        alert("Product added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // دالة فتح modal التأكيد
  const openDeleteConfirm = (productId, productName) => {
    setDeleteConfirm({ show: true, productId, productName });
  };

  // دالة حذف المنتج
  const handleDelete = async () => {
    const { productId } = deleteConfirm;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchProducts();
        alert("Product deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to delete product"}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setDeleteConfirm({ show: false, productId: null, productName: "" });
    }
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

  // دالة التعامل مع الصور
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // دالة حذف صورة
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // دالة للحصول على اسم الفئة من الـ ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
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
                // تعيين أول فئة كافتراضية عند فتح النموذج
                if (categories.length > 0) {
                  setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
                }
              }}
              className="flex items-center gap-2 bg-white border border-[#800000] text-[#800000] font-semibold px-4 py-2 rounded-full hover:scale-105 transition-transform"
            >
              <FaPlus /> Add New Product
            </button>

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
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onClick={() => handleProductsFilter(option)}
                    >
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
        <div className="text-center">ID</div>
        <div className="text-center">IMAGE</div>
        <div className="text-center">PRODUCT NAME</div>
        <div className="text-center">CATEGORY</div>
        <div className="text-center">PRICE</div>
        <div className="text-center">STOCK</div>
        <div className="text-center">ACTION</div>
      </div>

      {/* Loading State */}
      {fetchingProducts && (
        <div className="flex justify-center items-center h-32">
          <div className="text-[#800000]">Loading products...</div>
        </div>
      )}

      {/* Product List */}
      {!fetchingProducts && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] px-4">
          <FaBoxOpen className="text-[#800000] text-6xl mb-4" />
          <p className="text-[#800000] font-semibold text-lg mb-2">
            No products have been added yet.
          </p>
          <p className="text-gray-500 text-sm">
            Once you add products, they will appear here.
          </p>
        </div>
      ) : !fetchingProducts ? (
        <div className="px-4 space-y-2">
          {products.map((product, index) => (
            <div
              key={product.productId || index}
              className="grid grid-cols-7 gap-4 items-center text-center border-b py-2"
            >
              <div>{product.productId}</div>
              <div>
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={product.imageUrls[0]}
                    alt="product"
                    className="w-10 h-10 object-cover mx-auto rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 mx-auto rounded flex items-center justify-center">
                    <FaBoxOpen className="text-gray-400 text-xs" />
                  </div>
                )}
              </div>
              <div className="truncate">{product.name}</div>
              <div className="truncate">{getCategoryName(product.categoryId)}</div>
              <div>${product.price}</div>
              <div
                className={
                  product.stockQuantity === 0
                    ? "text-red-500 font-semibold"
                    : ""
                }
              >
                {product.stockQuantity}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() =>
                    openDeleteConfirm(product.productId, product.name)
                  }
                  className="bg-white border border-[#800000] text-[#800000] p-2 rounded-full hover:scale-105 transition"
                  title="Delete Product"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={formRef}
            className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-[#800000] text-white py-3 text-lg font-semibold text-center">
              Add New Product
            </div>

            <div className="p-6">
              {/* Image Upload */}
              <div className="mb-4">
                <p className="font-medium mb-1">Images</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        className="w-12 h-12 object-cover border rounded"
                        alt={`Preview ${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="w-12 h-12 border border-dashed rounded flex items-center justify-center cursor-pointer text-gray-400 hover:border-[#800000]">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
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
                {formErrors.name && (
                  <p className="text-red-500 text-sm">{formErrors.name}</p>
                )}
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Category</label>
                {fetchingCategories ? (
                  <div className="text-gray-500 text-sm">Loading categories...</div>
                ) : (
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#800000] ${
                      formErrors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {formErrors.categoryId && (
                  <p className="text-red-500 text-sm">{formErrors.categoryId}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#800000] ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm">
                    {formErrors.description}
                  </p>
                )}
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
                {formErrors.price && (
                  <p className="text-red-500 text-sm">{formErrors.price}</p>
                )}
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
                {formErrors.stock && (
                  <p className="text-red-500 text-sm">{formErrors.stock}</p>
                )}
              </div>

              {/* Save Product Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleAddProduct}
                  disabled={loading}
                  className="mt-6 px-5 py-2 bg-[#800000] text-white rounded-full text-sm font-semibold hover:bg-[#a33] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <FaTrash className="text-red-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{deleteConfirm.productName}"?
                This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      show: false,
                      productId: null,
                      productName: "",
                    })
                  }
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition"
                >
                  Delete
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