import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  useEffect(() => {
    // ====== Dummy data for testing only ======
    const dummySellers = [
      {
        id: 1,
        name: "Ahmed Ali",
        email: "ahmed@example.com",
        joinDate: "2024-06-10",
        status: "Pending",
      },
      {
        id: 2,
        name: "Sara Mostafa",
        email: "sara@example.com",
        joinDate: "2024-06-09",
        status: "Approved",
      },
    ];

    const dummyBrands = [
      {
        sellerEmail: "ahmed@example.com",
        brandName: "AhmedTech",
        category: "Electronics",
      },
      {
        sellerEmail: "sara@example.com",
        brandName: "SaraStyle",
        category: "Fashion",
      },
    ];

    // Only set dummy data once if not exists
    if (!localStorage.getItem("sellers")) {
      localStorage.setItem("sellers", JSON.stringify(dummySellers));
    }
    if (!localStorage.getItem("brands")) {
      localStorage.setItem("brands", JSON.stringify(dummyBrands));
    }

    // ========== Load from localStorage ==========
    const savedSellers = JSON.parse(localStorage.getItem("sellers")) || [];
    const brandData = JSON.parse(localStorage.getItem("brands")) || [];

    const updatedSellers = savedSellers.map((seller) => {
      const brand = brandData.find((b) => b.sellerEmail === seller.email);
      return {
        ...seller,
        brandName: brand?.brandName || "-",
        category: brand?.category || "-",
        status: seller.status || "Pending",
      };
    });

    setSellers(updatedSellers);
  }, []);

  const handleApprove = (sellerId) => {
    const updated = sellers.map((s) =>
      s.id === sellerId ? { ...s, status: "Approved" } : s
    );
    setSellers(updated);
    localStorage.setItem("sellers", JSON.stringify(updated));
    toast.success("Seller approved", {
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      icon: false,
      style: {
        color: "#7a0d0d",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  };

  const handleReject = (sellerId) => {
    const updated = sellers.map((s) =>
      s.id === sellerId ? { ...s, status: "Rejected" } : s
    );
    setSellers(updated);
    localStorage.setItem("sellers", JSON.stringify(updated));
    toast.success("Seller rejected", {
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      icon: false,
      style: {
        color: "#7a0d0d",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  };

  const filteredSellers = sellers.filter((s) => {
    const statusMatch =
      filterStatus.toLowerCase() === "all"
        ? true
        : s.status?.toLowerCase() === filterStatus.toLowerCase();
    const idMatch = String(s.id)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return statusMatch && idMatch;
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center text-[#7a0d0d] mb-6">
        Manage Sellers
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded">
        <input
          type="text"
          placeholder="Search by Seller ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border  rounded-md px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border  rounded-md px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
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
              <th className="px-4 py-3 border">Seller_ID</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Brand Name</th>
              <th className="px-4 py-3 border">Category</th>
              <th className="px-4 py-3 border">Join Date</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.map((seller) => (
              <tr key={seller.id} className="text-sm text-gray-700">
                <td className="px-4 py-3 border align-middle">
                  S{String(seller.id).padStart(3, "0")}
                </td>
                <td className="px-4 py-3 border align-middle">{seller.name}</td>
                <td className="px-4 py-3 border align-middle">{seller.email}</td>
                <td className="px-4 py-3 border align-middle">{seller.brandName}</td>
                <td className="px-4 py-3 border align-middle">{seller.category}</td>
                <td className="px-4 py-3 border align-middle">{seller.joinDate}</td>
                <td className="px-4 py-3 border align-middle">{seller.status}</td>
                <td className="px-4 py-3 border align-middle space-x-2">
                 <button
  onClick={() => handleApprove(seller.id)}
  className="bg-[#7a0d0d] text-white text-sm px-3 py-1 rounded-full hover:bg-red-800"
>
  Approve
</button>
<button
  onClick={() => handleReject(seller.id)}
  className="bg-[#7a0d0d] text-white text-sm px-3 py-1 rounded-full hover:bg-red-800"
>
  Reject
</button>

                </td>
              </tr>
            ))}
            {filteredSellers.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-6 text-gray-500 text-center text-sm"
                >
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSellers;
