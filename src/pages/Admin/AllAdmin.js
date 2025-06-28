import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaTrash,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

const AllAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://shopyapi.runasp.net/api/AddingAdmin/GetAllAdmins",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to load admins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDeleteAdmin = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `https://shopyapi.runasp.net/api/AddingAdmin/DeleteAdmin/${adminToDelete.userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header - you'll need to get the token from your auth system
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            // const token = localStorage.getItem("authToken");
          },
        }
      );

      if (response.ok) {
        // Remove admin from local state
        setAdmins(
          admins.filter((admin) => admin.userId !== adminToDelete.userId)
        );
        setShowDeleteModal(false);
        setAdminToDelete(null);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert(error.message || "Failed to delete admin. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-800"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading admins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-red-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchAdmins}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaUsers className="text-red-800 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Management
                </h1>
                <p className="text-gray-600">
                  View and manage all admin accounts ({admins.length} total)
                </p>
              </div>
            </div>
            <button
  onClick={fetchAdmins}
  className="bg-[#7a0d0d] hover:bg-red-900 text-white px-5 py-2 rounded-full font-medium transition-colors duration-200"
>
  Refresh
</button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {admins.map((admin) => (
            <div
              key={admin.userId}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Avatar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                    {admin.firstName?.charAt(0) || "A"}
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ID: {admin.userId}
                  </span>
                </div>

                {/* Admin Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {admin.firstName} {admin.lastName}
                    </h3>
                    <p className="text-red-600 text-sm font-medium">
                      @{admin.userName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaEnvelope className="mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-gray-400 flex-shrink-0" />
                      <span>Joined {formatDate(admin.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
  <button
    onClick={() => handleDeleteAdmin(admin)}
    className="text-[#7a0d0d] hover:text-white transition-colors duration-200 hover:bg-red-800 px-4 py-2 rounded-full text-sm font-medium"
  >
    Delete
  </button>
</div>

              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {admins.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Admins Found
            </h3>
            <p className="text-gray-600">
              No admin accounts are currently available
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <FaTrash className="text-red-600 text-xl" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Confirm Delete
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete admin{" "}
                <strong>
                  {adminToDelete?.firstName} {adminToDelete?.lastName}
                </strong>
                ?
                <br />
                This action cannot be undone.
              </p>

              <div className="flex gap-4">
  {/* زر Yes, Delete */}
  <button
    onClick={confirmDelete}
    disabled={deleteLoading}
    className="flex-1 bg-[#7a0d0d] hover:bg-red-900 disabled:bg-red-400 text-white py-3 rounded-full font-medium transition-colors duration-200 flex items-center justify-center"
  >
    {deleteLoading ? (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Deleting...
      </>
    ) : (
      "Yes, Delete"
    )}
  </button>

  {/* زر Cancel */}
  <button
    onClick={() => setShowDeleteModal(false)}
    disabled={deleteLoading}
    className="flex-1 bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-[#7a0d0d] py-3 rounded-full font-medium transition-colors duration-200"
  >
    Cancel
  </button>
</div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAdmin;
