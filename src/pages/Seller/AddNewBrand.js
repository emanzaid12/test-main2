import { useState } from "react";

const AddNewBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation basic
    if (!brandName || !category) {
      alert("Please fill all required fields!");
      return;
    }

    console.log({ brandName, description, category });
    // هنا ممكن تبعتي البيانات للسيرفر لو حابة
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-[#800000] text-white rounded-lg p-10 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">Add New Brand</h2>
        <p className="text-sm text-center mb-6">Let’s build a brand that inspires!</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Brand Name */}
          <div>
            <input
              type="text"
              placeholder="Brand Name "
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
              rows="3"
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <input
              type="text"
              placeholder="Category "
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-white text-[#800000] font-bold py-2 px-6 rounded-full mx-auto block transform transition-transform duration-200 hover:scale-110 hover:bg-gray-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewBrand;

