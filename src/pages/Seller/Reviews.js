import {
  FaStar,
  FaRegStar,
  FaEnvelope,
  FaCommentDots,
  FaHeart,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://shopyapi.runasp.net/api/Review";

const Reviews = () => {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {},
  });
  const [productsWithReviews, setProductsWithReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingLoading, setRatingLoading] = useState({});

  // Mock token - replace with actual token from your auth system
 // const authToken = "your-auth-token-here";
  const authToken = localStorage.getItem("authToken");

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/seller-stats`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProductsWithReviews = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/seller-products-with-reviews`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error("");

      const data = await response.json();
      setProductsWithReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const rateReview = async (reviewId, productId, rating) => {
    setRatingLoading((prev) => ({ ...prev, [reviewId]: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/rate-review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: reviewId,
          productId: productId,
          sellerRating: rating,
        }),
      });

      if (!response.ok) throw new Error("Failed to rate review");

      // Update the review in the state
      setProductsWithReviews((prev) =>
        prev.map((product) => ({
          ...product,
          reviews: product.reviews.map((review) =>
            review.reviewId === reviewId
              ? { ...review, sellerRating: rating }
              : review
          ),
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setRatingLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchProductsWithReviews()]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-xl text-[#800000]">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  const getRatingDistributionForChart = () => {
    const total = stats.totalReviews || 1;
    return [
      {
        label: "5★",
        width: `${((stats.ratingDistribution[5] || 0) / total) * 100}%`,
        value: (stats.ratingDistribution[5] || 0).toFixed(0),
        color: "#a73439",
      },
      {
        label: "4★",
        width: `${((stats.ratingDistribution[4] || 0) / total) * 100}%`,
        value: (stats.ratingDistribution[4] || 0).toFixed(0),
        color: "#c7686b",
      },
      {
        label: "3★",
        width: `${((stats.ratingDistribution[3] || 0) / total) * 100}%`,
        value: (stats.ratingDistribution[3] || 0).toFixed(0),
        color: "#e9a1a3",
      },
      {
        label: "2★",
        width: `${((stats.ratingDistribution[2] || 0) / total) * 100}%`,
        value: (stats.ratingDistribution[2] || 0).toFixed(0),
        color: "#f4c2c2",
      },
      {
        label: "1★",
        width: `${((stats.ratingDistribution[1] || 0) / total) * 100}%`,
        value: (stats.ratingDistribution[1] || 0).toFixed(0),
        color: "#fce4e4",
      },
    ];
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-center text-[#800000] mb-6">
         Reviews Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {/* Total Reviews */}
        <div className="bg-gray-50 pt-6 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-[#800000]">
            {stats.totalReviews >= 1000
              ? `${(stats.totalReviews / 1000).toFixed(1)}k`
              : stats.totalReviews}
          </p>
          <p className="text-sm text-gray-400 mt-1">All time reviews</p>
        </div>

        {/* Average Rating */}
        <div className="bg-gray-50 pt-6 p-4 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 mb-1">Average Rating</p>
          <div className="flex justify-center items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-[#800000]">
              {stats.averageRating}
            </span>
            <div className="flex text-yellow-500">
              {[...Array(Math.floor(stats.averageRating))].map((_, i) => (
                <FaStar key={i} className="animate-fade-in-star" />
              ))}
              {stats.averageRating % 1 !== 0 && (
                <FaStar className="opacity-50" />
              )}
              {[...Array(5 - Math.ceil(stats.averageRating))].map((_, i) => (
                <FaRegStar key={i} />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">Overall rating</p>
        </div>

        {/* Rating Distribution Chart */}
        <div className="bg-gray-50 pt-6 p-4 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-2">Rating Distribution</p>
          <div className="space-y-3 text-sm text-gray-600 w-full px-4">
            {getRatingDistributionForChart().map((bar, idx) => (
              <div key={idx} className="flex items-center w-full">
                <span className="w-6 text-left">{bar.label}</span>
                <div className="relative flex-1 h-3 bg-white rounded mx-2 overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-1000"
                    style={{
                      width: bar.width,
                      backgroundColor: bar.color,
                      animation: "growBar 1s ease forwards",
                      animationDelay: `${idx * 100}ms`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-700 w-10 text-left">
                  {bar.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products with Reviews */}
      <div className="space-y-8">
        {productsWithReviews.map((product) => (
          <div
            key={product.productId}
            className="bg-gray-50 p-6 rounded-lg shadow-sm"
          >
            {/* Product Header */}
            <div className="mb-6 border-b pb-4">
              <div className="flex items-start gap-4">
                {product.productImages && product.productImages.length > 0 && (
                  <img
                    src={product.productImages[0]}
                    alt={product.productName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#800000] mb-2">
                    {product.productName}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {product.productDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Price: <strong>${product.productPrice}</strong>
                    </span>
                    <span>
                      Average Rating: <strong>{product.averageRating}</strong>
                    </span>
                    <span>
                      Total Reviews: <strong>{product.totalReviews}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#800000] mb-4">
                Reviews ({product.totalReviews})
              </h3>
              {product.reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#800000]"
                >
                  <div className="flex gap-4">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-[#800000]">
                            {review.userName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {review.userEmail}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.reviewDate}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 mb-2">
                        Total Spend: <strong>${review.userTotalSpend}</strong> •
                        Total Reviews:{" "}
                        <strong>{review.userTotalReviews}</strong>
                      </div>

                      <div className="flex text-yellow-500 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <FaRegStar key={i} />
                        ))}
                      </div>

                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      {/* Seller Rating Section */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Your Rating for this Review:
                          </span>
                          <div className="flex items-center gap-2">
                            {review.sellerRating && (
                              <span className="text-sm text-[#800000] font-medium">
                                Current:{" "}
                                {review.sellerRating === 1
                                  ? "Helpful"
                                  : "Not Helpful"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() =>
                              rateReview(review.reviewId, product.productId, 1)
                            }
                            disabled={ratingLoading[review.reviewId]}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                              review.sellerRating === 1
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-green-100"
                            } disabled:opacity-50`}
                          >
                            <FaThumbsUp />
                            Helpful
                          </button>

                          <button
                            onClick={() =>
                              rateReview(review.reviewId, product.productId, 0)
                            }
                            disabled={ratingLoading[review.reviewId]}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                              review.sellerRating === 0
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-red-100"
                            } disabled:opacity-50`}
                          >
                            <FaThumbsDown />
                            Not Helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {productsWithReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products with reviews found.
          </p>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes growBar {
          from {
            width: 0;
          }
        }
        .animate-fade-in-star {
          animation: fadeIn 0.4s ease forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Reviews;
