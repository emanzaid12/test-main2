import {
  FaStar,
  FaRegStar,
  FaEnvelope,
  FaCommentDots,
  FaHeart,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const reviewsData = [
  {
    name: "Towhidur Rahman",
    spend: "$200",
    totalReviews: 14,
    date: "24-04-2025",
    rating: 4,
    message:
      "My first and only mala ordered on Etsy, and I’m beyond delighted! I requested a custom mala based on two stones I was called to invite together in this kind of creation. The fun and genuine joy.",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Another User",
    spend: "$320",
    totalReviews: 21,
    date: "12-03-2025",
    rating: 5,
    message:
      "Absolutely beautiful. The colors, craftsmanship, and intention behind each bead was felt. Will definitely order again.",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => setReviews(reviewsData), 300);

    let start = 0;
    const end = 10000;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setCount(start);
    }, 16);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold  text-center text-[#800000] mb-6">
        Reviews
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {/* Total Reviews */}
        <div className="bg-gray-50 pt-6 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-[#800000]">
            {(count / 1000).toFixed(1)}k
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Growth in reviews on this year
          </p>
        </div>

        {/* Average Rating */}
        <div className="bg-gray-50 pt-6 p-4 rounded-lg shadow-sm text-center flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 mb-1">Average Rating</p>
          <div className="flex justify-center items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-[#800000]">4.0</span>
            <div className="flex text-yellow-500">
              {[...Array(4)].map((_, i) => (
                <FaStar
                  key={i}
                  className="opacity-0 animate-fade-in-star"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
              <FaRegStar />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Average rating on this year
          </p>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-50 pt-6 p-4 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-2">March 2024 - April 2025</p>
          <div className="space-y-3 text-sm text-gray-600 w-full px-4">
            {[
              { label: "5★", width: "70%", value: "7.0k", color: "#a73439" },
              { label: "4★", width: "15%", value: "1.5k", color: "#c7686b" },
              { label: "3★", width: "7%", value: "500", color: "#e9a1a3" },
              { label: "2★", width: "4%", value: "200", color: "#f4c2c2" },
              { label: "1★", width: "2%", value: "0k", color: "#fce4e4" },
            ].map((bar, idx) => (
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

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="flex gap-4 bg-gray-50 p-4 rounded-lg shadow-sm animate-fade-in-up items-center justify-between pt-4"
          >
            <img
              src={review.avatar}
              alt={review.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#800000]">{review.name}</h2>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                Total Spend: <strong>{review.spend}</strong> • Total Review:{" "}
                <strong>{review.totalReviews}</strong>
              </div>
              <div className="flex text-yellow-500 mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="animate-star-scale" />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <FaRegStar key={i} />
                ))}
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-line">
                {review.message}
              </p>
              {/* <div className="flex gap-3 items-center">
  <button className="flex items-center gap-2 bg-[#800000] text-white text-sm px-4 py-2 rounded-full hover:scale-105 hover:bg-[#a03c3c] transition-all">
    <FaCommentDots />
    Public Comment
  </button>
  <button className="flex items-center gap-2 bg-[#800000] text-white text-sm px-4 py-2 rounded-full hover:scale-105 hover:bg-[#a03c3c] transition-all">
    <FaEnvelope />
    Direct Message
  </button>
  <div className="w-8 h-8 flex items-center justify-center bg-[#800000] text-white rounded-full hover:scale-110 transition-all cursor-pointer">
    <FaHeart />
  </div>
</div> */}
            </div>
          </div>
        ))}
      </div>

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
        .animate-star-scale {
          animation: starScale 0.4s ease-in-out;
        }
        @keyframes starScale {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Reviews;
