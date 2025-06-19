import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dummyReviews = [
  {
    id: 1,
    reviewer: "Mona Hassan",
    product: "Smart Watch",
    seller: "TechZone",
    rating: 5,
    date: "2025-06-09",
    content: "Excellent product with very high quality. Highly recommended!",
  },
  {
    id: 2,
    reviewer: "Nada Fathy", 
    product: "Hair Dryer",
    seller: "BeautyWorld",
    rating: 2, 
    date: "2025-06-08",
    content: "Not powerful enough and too noisy.",
  },
  {
    id: 3,
    reviewer: "Ali Ibrahim",
    product: "Cotton T-Shirt",
    seller: "Fashionista",
    rating: 4,
    date: "2025-06-07",
    content: "Soft fabric and correct sizing, but delivery was a bit late.",
  },
];

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    localStorage.setItem("userReviews", JSON.stringify(dummyReviews));
    const stored = JSON.parse(localStorage.getItem("userReviews")) || [];
    setReviews(stored);
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.id === "modalOverlay") {
      setSelectedReview(null);
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <FaStar key={i} className="text-yellow-400 inline-block" />
    ));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center text-[#7a0d0d] mb-6">
        Manage Reviews
      </h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100 text-[#7a0d0d] text-sm font-semibold">
              <th className="px-4 py-3 border">Review_ID</th>
              <th className="px-4 py-3 border">Reviewer</th>
              <th className="px-4 py-3 border">Product Name</th>
              <th className="px-4 py-3 border">Seller Name</th>
              <th className="px-4 py-3 border">Rating</th>
              <th className="px-4 py-3 border">Review Date</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="text-sm text-gray-700">
                <td className="px-4 py-3 border align-middle">
                  R{String(review.id).padStart(3, "0")}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {review.reviewer}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {review.product}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {review.seller}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {renderStars(review.rating)}
                </td>
                <td className="px-4 py-3 border align-middle">
                  {review.date}
                </td>
                <td className="px-4 py-3 border align-middle">
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="bg-[#7a0d0d] text-white px-3 py-1 rounded-full hover:bg-red-800 text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-gray-500 text-center text-sm"
                >
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Line Chart */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-[#7a0d0d] mb-4">
          Review Ratings Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={reviews.map((r) => ({
              reviewer: r.reviewer,
              rating: r.rating,
            }))}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <XAxis dataKey="reviewer" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line
              type="natural"
              dataKey="rating"
              stroke="#b30000"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Modal */}
      {selectedReview && (
        <div
          id="modalOverlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
        >
          <div className="bg-white w-[90%] md:w-[500px] rounded-lg shadow-lg">
            <div className="bg-[#7a0d0d] text-white px-6 py-3 rounded-t-lg text-center">
              <h3 className="text-lg font-semibold">Review Details</h3>
            </div>
            <div className="p-6 space-y-4 text-left">
              <p>
                <span className="text-[#7a0d0d] font-semibold">Reviewer:</span>{" "}
                <span className="text-black">{selectedReview.reviewer}</span>
              </p>
              <p>
                <span className="text-[#7a0d0d] font-semibold">Product Name:</span>{" "}
                <span className="text-black">{selectedReview.product}</span>
              </p>
              <p>
                <span className="text-[#7a0d0d] font-semibold">Seller Name:</span>{" "}
                <span className="text-black">{selectedReview.seller}</span>
              </p>
              <p>
                <span className="text-[#7a0d0d] font-semibold">Rating:</span>{" "}
                <span className="text-black">
                  {renderStars(selectedReview.rating)}
                </span>
              </p>
              <p>
                <span className="text-[#7a0d0d] font-semibold">Date:</span>{" "}
                <span className="text-black">{selectedReview.date}</span>
              </p>
              <p>
                <span className="text-[#7a0d0d] font-semibold">Content:</span>{" "}
                <span className="text-black">{selectedReview.content}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
