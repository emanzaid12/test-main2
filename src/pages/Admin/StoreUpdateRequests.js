import React, { useState, useEffect } from "react";
import {
  FaStore,
  FaCheck,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

const StoreUpdateRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  // Base API URL
  const API_BASE_URL = "https://shopyapi.runasp.net/api/Admin";

  // Get token from localStorage (you might need to adjust this based on your auth setup)
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/edit-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/approve-edit-request/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the approved request from the list
      setRequests(requests.filter((req) => req.id !== requestId));
      setShowModal(false);

      // Show success message (you can add a toast notification here)
      alert("Request approved successfully!");
    } catch (error) {
      console.error("Error approving request:", error);
      setError("Failed to approve request. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reject-edit-request/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the rejected request from the list
      setRequests(requests.filter((req) => req.id !== requestId));
      setShowModal(false);

      // Show success message (you can add a toast notification here)
      alert("Request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      setError("Failed to reject request. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store update requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 text-center">
  <div className="flex items-center justify-center gap-3 mb-4">
    <FaStore className="text-red-800 text-3xl" />
    <h1 className="text-3xl font-bold text-gray-800">
      Store Update Requests
    </h1>
  </div>
  <p className="text-gray-600">
    Review and manage store update requests from sellers
  </p>
</div>


      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button
            onClick={fetchRequests}
            className="ml-4 text-red-800 underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">
                {requests.length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCalendarAlt className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Requests</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  requests.filter((req) => {
                    const today = new Date();
                    const requestDate = new Date(req.requestDate);
                    const diffTime = Math.abs(today - requestDate);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 7;
                  }).length
                }
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stores</p>
              <p className="text-2xl font-bold text-red-800">
                {new Set(requests.map((req) => req.storeId)).size}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaStore className="text-red-800 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Pending Requests ({requests.length})
          </h2>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <FaStore className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending requests
            </h3>
            <p className="text-gray-500">
              All store update requests have been processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updates Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <FaStore className="text-red-800" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Store ID: {request.storeId}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaUser className="mr-1" />
                            {request.sellerName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.newName && (
                          <div className="mb-1">
                            <span className="font-medium">Name:</span>{" "}
                            {request.newName}
                          </div>
                        )}
                        {request.newDescription && (
                          <div className="mb-1">
                            <span className="font-medium">Description:</span>
                            <span className="text-gray-600 ml-1">
                              {request.newDescription.length > 50
                                ? `${request.newDescription.substring(
                                    0,
                                    50
                                  )}...`
                                : request.newDescription}
                            </span>
                          </div>
                        )}
                        {(request.newStreet ||
                          request.newCity ||
                          request.newGovernorate) && (
                          <div className="text-xs text-gray-500">
                            Location updates requested
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal(request)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <FaEye className="mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                      >
                        {processingId === request.id ? (
                          <FaSpinner className="mr-1 animate-spin" />
                        ) : (
                          <FaCheck className="mr-1" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={processingId === request.id}
                        className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                      >
                        {processingId === request.id ? (
                          <FaSpinner className="mr-1 animate-spin" />
                        ) : (
                          <FaTimes className="mr-1" />
                        )}
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for viewing request details */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Store Update Request Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Store ID
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedRequest.storeId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Seller Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedRequest.sellerName}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Request Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedRequest.requestDate)}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Requested Changes:
                  </h4>

                  {selectedRequest.newName && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        New Store Name
                      </label>
                      <div className="bg-green-50 p-3 rounded border">
                        <p className="text-sm text-gray-900">
                          {selectedRequest.newName}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedRequest.newDescription && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        New Description
                      </label>
                      <div className="bg-green-50 p-3 rounded border">
                        <p className="text-sm text-gray-900">
                          {selectedRequest.newDescription}
                        </p>
                      </div>
                    </div>
                  )}

                  {(selectedRequest.newStreet ||
                    selectedRequest.newCity ||
                    selectedRequest.newGovernorate) && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        New Address
                      </label>
                      <div className="bg-green-50 p-3 rounded border">
                        {selectedRequest.newStreet && (
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Street:</span>{" "}
                            {selectedRequest.newStreet}
                          </p>
                        )}
                        {selectedRequest.newCity && (
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">City:</span>{" "}
                            {selectedRequest.newCity}
                          </p>
                        )}
                        {selectedRequest.newGovernorate && (
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Governorate:</span>{" "}
                            {selectedRequest.newGovernorate}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={processingId === selectedRequest.id}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center disabled:opacity-50"
                >
                  {processingId === selectedRequest.id ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    <FaTimes className="mr-2" />
                  )}
                  Reject Request
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  disabled={processingId === selectedRequest.id}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center disabled:opacity-50"
                >
                  {processingId === selectedRequest.id ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    <FaCheck className="mr-2" />
                  )}
                  Approve Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreUpdateRequests;
