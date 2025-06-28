import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/productSlice";
import { addToFavorites, removeFromFavorites } from "../redux/favoriteSlice";
import { useParams } from "react-router-dom";
import {
  FaCarSide,
  FaQuestion,
  FaHeart,
  FaRegHeart,
  FaStar,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: "", comment: "" });
  const [topReviews, setTopReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://shopyapi.runasp.net/api/Products/${id}`
        );
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);

        if (token) {
          const favRes = await fetch(
            "https://shopyapi.runasp.net/api/Favourite/my",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (favRes.ok) {
            const favList = await favRes.json();
            const exists = favList.some(
              (item) => item.productId === data.productId
            );
            setIsFavorite(exists);
          }
        }
        fetchTopReviews(data.productId);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const fetchTopReviews = async (productId) => {
    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Review/top-reviews?productId=${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setTopReviews(data);
    } catch (error) {
      console.error("Error loading top reviews", error);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Review/all-reviews?productId=${product.productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setAllReviews(data);
      setShowAllReviews(true);
    } catch (error) {
      console.error("Error loading all reviews", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://shopyapi.runasp.net/api/Review/add-review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...reviewData, productId: product.productId }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        setReviewData({ rating: "", comment: "" });
        fetchTopReviews(product.productId);
      } else {
        toast.error(result.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error submitting review", error);
      toast.error("Something went wrong");
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) return toast.warn("Please login first.");

    try {
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Favourite/toggle?productId=${product.productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        if (isFavorite) {
          dispatch(removeFromFavorites(product.productId));
          setIsFavorite(false);
          toast.info("Removed from favorites");
        } else {
          dispatch(addToFavorites(product));
          setIsFavorite(true);
          toast.success("Added to favorites");
        }
      } else {
        const errorData = await response.text();
        console.error("API Error:", errorData);
        toast.error("Failed to toggle favorite.");
      }
    } catch (error) {
      console.error("Toggle Favorite Error:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleToggleCart = async () => {
    if (!token) return toast.warn("Please login first.");

    try {
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Cart/add?productId=${product.productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const text = await response.text();
      if (response.ok) {
        toast.success(text);
      } else {
        toast.error(`Error: ${text}`);
      }
    } catch (error) {
      console.error("Cart Toggle Error:", error);
      toast.error("Something went wrong while updating cart.");
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product)
    return (
      <div className="text-center py-12 text-red-600">Product not found!</div>
    );

  const imageUrl =
    product.imageUrls?.[0] ||
    product.images?.[0]?.imagePath ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < count ? "text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 transition-transform hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-gray-800">
          {review.userName}
        </h4>
        {renderStars(review.userRating)}
      </div>
      <p className="text-gray-600 italic">"{review.comment}"</p>
      <p className="text-xs text-gray-400 mt-2 text-right">
        {new Date(review.createdAt).toLocaleDateString()} - {" "}
        {new Date(review.createdAt).toLocaleTimeString()}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      <div className="flex flex-col md:flex-row gap-x-8">
        <div className="md:w-1/2 relative bg-white p-4 rounded-lg shadow-md flex justify-center items-center h-[400px]">
          <img src={imageUrl} alt={product.name} className="max-h-full" />
          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 left-4 text-red-600 hover:text-red-800"
          >
            {isFavorite ? <FaHeart size={26} /> : <FaRegHeart size={26} />}
          </button>
        </div>

        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
          <h2 className="text-2xl text-red-800 font-bold">{product.name}</h2>
          <div className="flex flex-row items-center gap-6">
  <p className="text-2xl text-gray-800 font-bold">${product.price?.toFixed(2)}</p>
  <div className="flex items-center gap-2">
    <span className="text-gray-600">Qty</span>
    <input
      type="number"
      min="1"
      className="border p-1 w-16 rounded text-center"
      defaultValue="1"
      disabled
    />
  </div>
</div>

          <div>
            <h3 className="text-lg font-semibold">Product Description</h3>
            <p className="text-gray-600">{product.description || "No description available."}</p>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-full transition-transform hover:scale-105"
              onClick={handleToggleCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">Top Reviews</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {topReviews.length > 0 ? (
            topReviews.map((r, index) => <ReviewCard key={index} review={r} />)
          ) : (
            <p className="text-gray-500 col-span-2">No reviews yet.</p>
          )}
        </div>
        {!showAllReviews && (
          <button
            onClick={fetchAllReviews}
            className="mt-4 text-red-600 hover:underline"
          >
            Show All Reviews
          </button>
        )}
        {showAllReviews && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">All Reviews</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {allReviews.map((r, index) => (
                <ReviewCard key={index} review={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-2">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4 mt-6">
          <div>
            <label className="block font-medium">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={reviewData.rating}
              onChange={(e) =>
                setReviewData({ ...reviewData, rating: e.target.value })
              }
              className="border p-2 rounded w-20 focus:outline-none focus:ring-2 focus:ring-[#800020]"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Comment</label>
            <textarea
              placeholder="Write your comment"
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({ ...reviewData, comment: e.target.value })
              }
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#800020]"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-full text-lg transition-transform hover:scale-105"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
