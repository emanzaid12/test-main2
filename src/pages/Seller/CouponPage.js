import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import { FaGift } from "react-icons/fa";  // استيراد الأيقونة الكبيرة
import { Dialog } from "@headlessui/react";

const CouponPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    code: "",
    percentage: "",
    startDate: "",
    expireDate: "",
  });
  const [coupons, setCoupons] = useState([]);

  const handleOpen = () => {
    setIsModalOpen(true);
    setEditingIndex(null);
    setForm({
      code: "",
      percentage: "",
      startDate: "",
      expireDate: "",
    });
  };

  const handleEdit = (index) => {
    setIsModalOpen(true);
    setEditingIndex(index);
    setForm(coupons[index]);
  };

  const handleDelete = (index) => {
    setCoupons(coupons.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      const updated = [...coupons];
      updated[editingIndex] = form;
      setCoupons(updated);
    } else {
      setCoupons([...coupons, form]);
    }
    setIsModalOpen(false);
  };

  const checkStatus = (expireDate) => {
    const now = new Date();
    const exp = new Date(expireDate);
    return now < exp ? "active" : "expired";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Add Coupon Button */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-red-800 text-xl font-semibold mb-2">
          Add New Coupon
        </h2>
        <div
          onClick={handleOpen}
          className="w-96 h-20 border-2 border-dashed border-red-800 flex items-center justify-center text-red-800 text-3xl cursor-pointer rounded-full hover:bg-red-50 transition"
        >
          <FiPlus />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon, index) => {
          const status = checkStatus(coupon.expireDate);
          return (
            <div
              key={index}
              className="bg-red-800 text-white p-5 rounded-lg relative shadow-md"
            >
              {/* Gift Icon (on the right side of "GIFT CARD") */}
              <div className="absolute top-5 right-3 text-white text-4xl">
                <FaGift />
              </div>

              <h3 className="text-lg font-semibold mb-1">GIFT CARD</h3>
              <p className="text-2xl font-bold mb-1">{coupon.percentage}% OFF</p>
              <p className="mb-2">Any Purchase</p>

              <div
                className={`mb-3 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  status === "active"
                    ? "bg-white text-red-800"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {status === "active" ? "Active" : "Expired"}
              </div>

              <p className="text-sm mb-2">
                Expires on:{" "}
                <span className="font-medium">{coupon.expireDate}</span>
              </p>

              <div className="bg-white text-black rounded-full px-4 py-2 text-sm flex justify-between items-center">
                <span>{coupon.code}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(index)}>
                    <FiEdit className="text-red-800 hover:text-red-600" />
                  </button>
                  <button onClick={() => handleDelete(index)}>
                    <FiTrash className="text-red-800 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-red-800 text-white text-center py-3 text-lg font-semibold">
              {editingIndex !== null ? "Edit Coupon" : "Add New Coupon"}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coupon Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700">
    Discount (%)
  </label>
  <input
    type="number"
    name="percentage"
    value={form.percentage}
    onChange={handleChange}
    min="0"  // التأكد من قبول الأرقام فقط
    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
  />
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expire Date
                </label>
                <input
                  type="date"
                  name="expireDate"
                  value={form.expireDate}
                  onChange={handleChange}
                  min={form.startDate}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleSave}
                  className="bg-red-800 hover:bg-red-600 transition transform hover:scale-105 text-white px-6 py-2 rounded-full text-sm font-medium"
                >
                  {editingIndex !== null ? "Save Changes" : "Add Coupon"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default CouponPage;
