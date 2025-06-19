import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/images/your-image.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = () => {
    if (!email.trim()) {
      setError("Email is required");
    } else {
      setError("");
      // Send email to reset-confirmation page
      navigate("/reset-confirmation", { state: { email } });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white p-10 rounded-[60px] shadow-md w-[520px] text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address to receive reset code.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800"
        />

        {error && <p className="text-sm text-red-700 mb-2">{error}</p>}

        <button
          type="button"
          onClick={handleReset}
          className="bg-red-800 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 hover:scale-105 transition-transform duration-200"
        >
          RESET PASSWORD
        </button>

        <Link
          to="/loginregister"
          className="block mt-4 text-sm text-red-800 hover:"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
