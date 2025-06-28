import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  const apiMap = {
    All: "https://shopyapi.runasp.net/api/Admin/all-sellers",
    Approved: "https://shopyapi.runasp.net/api/Admin/approved-sellers",
    Rejected: "https://shopyapi.runasp.net/api/Admin/rejected-sellers",
    Pending: "https://shopyapi.runasp.net/api/Admin/pending-sellers",
  };

  const fetchSellersFromAPI = async (status) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(apiMap[status], {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const formattedSellers = data.map((seller) => ({
        id: seller.userId,
        name: seller.fullName,
        email: seller.email,
        brandName: seller.storeName,
        description: seller.storeDescription || "-",
        joinDate: seller.requestDate,
        status: seller.status,
        category: seller.categoryName || "-",
      }));
      setSellers(formattedSellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to load sellers data.");
    }
  };

  useEffect(() => {
    fetchSellersFromAPI(filterStatus);
  }, [filterStatus]);

  const handleApprove = async (sellerId) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Admin/approve-seller/${sellerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        toast.success("Seller has been approved and store created successfully", {
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
        fetchSellersFromAPI(filterStatus);
      } else {
        const text = await response.text();
        console.error("Server error payload:", text);
        throw new Error("Failed to approve seller.");
      }
    } catch (error) {
      console.error("Error approving seller:", error);
      toast.error("Failed to approve seller.");
    }
  };

  const handleReject = async (sellerId) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Admin/reject-seller/${sellerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        toast.success("Seller has been rejected", {
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
        fetchSellersFromAPI(filterStatus);
      } else {
        throw new Error("Failed to reject seller.");
      }
    } catch (error) {
      console.error("Error rejecting seller:", error);
      toast.error("Failed to reject seller.");
    }
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
          className="border rounded-md px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-md px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
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
              <th className="px-4 py-3 border w-[100px]">Seller_ID</th>
              <th className="px-4 py-3 border w-[150px]">Name</th>
              <th className="px-4 py-3 border w-[200px]">Email</th>
              <th className="px-4 py-3 border w-[150px]">Brand Name</th>
              <th className="px-4 py-3 border w-[250px]">Store Description</th>
              <th className="px-4 py-3 border w-[150px]">Join Date</th>
              <th className="px-4 py-3 border w-[120px]">Status</th>
              <th className="px-4 py-3 border w-[150px]">Category-id</th>
              <th className="px-4 py-3 border w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.map((seller) => (
              <tr key={seller.id} className="text-sm text-gray-700 align-top">
                <td className="px-4 py-3 border align-middle">
                  S{String(seller.id).padStart(3, "0")}
                </td>
                <td className="px-4 py-3 border align-middle">{seller.name}</td>
                <td className="px-4 py-3 border align-middle">{seller.email}</td>
                <td className="px-4 py-3 border align-middle">{seller.brandName}</td>
                <td className="px-4 py-3 border align-middle break-words whitespace-pre-wrap">
                  {seller.description || "-"}
                </td>
                <td className="px-4 py-3 border align-middle">{seller.joinDate}</td>
                <td className="px-4 py-3 border align-middle">{seller.status}</td>
                <td className="px-4 py-3 border align-middle">{seller.category}</td>
                <td className="px-4 py-3 border align-middle">
                  {seller.status === "Pending" && (
                    <div className="flex flex-col md:flex-row justify-center items-center gap-2">
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
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredSellers.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-gray-500 text-center text-sm">
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