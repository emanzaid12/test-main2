import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import bgImage from "../assets/images/your-image.png";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      valid = false;
    } else {
      setError("");
    }

    if (password !== confirmPassword) {
      setMatchError("Passwords do not match.");
      valid = false;
    } else {
      setMatchError("");
    }

    if (valid) {
      console.log("Password reset successful");
      navigate("/reset-success");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-white rounded-[2.5rem] shadow-lg border border-gray-200 px-10 py-12 w-full max-w-lg text-center">
        <FiLock className="mx-auto text-[#800000] mb-4" size={40} />
        <h2 className="text-2xl font-bold text-black mb-2">Set new password</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Your new password must be different from previously used passwords.
        </p>

        <form className="space-y-5 text-left" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] transition-all"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-[#800000]"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Must be at least 8 characters.
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] transition-all"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-[#800000]"
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
            {matchError && (
              <p className="text-red-500 text-sm mt-1 ml-1">{matchError}</p>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="bg-[#800000] hover:bg-[#a00000] text-white font-semibold py-2 px-4 rounded-full text-sm transition-transform duration-200 hover:scale-105 mx-auto block text-center w-fit"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/loginregister"
            className="text-[#800000] text-sm font-medium no-underline hover:text-[#a00000] transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
