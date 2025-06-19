import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { useState } from "react";
import bgImage from "../assets/images/your-image.png";

const maskEmail = (email) => {
  if (!email) return "";
  const [name, domain] = email.split("@");
  const maskedName = name[0] + "*".repeat(name.length - 1);
  return `${maskedName}@${domain}`;
};

const ResetConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!code.trim()) {
      setError("Please enter the verification code.");
    } else {
      setError("");
      navigate("/reset-password", { state: { email, code } });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white rounded-[3rem] shadow-lg border border-gray-200 px-8 py-10 md:px-16 md:py-14 w-full max-w-lg text-center">
        <FiMail className="mx-auto text-[#800000] mb-4" size={40} />
        <h2 className="text-2xl font-bold text-black mb-2">Check your email</h2>

        <p className="text-gray-600 mb-4">
          We’ve sent an email to <span className="font-semibold">{maskEmail(email)}</span>
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ENTER CODE"
          className="w-full px-4 py-2 mb-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#800000] text-center"
        />

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        <button
          onClick={handleContinue}
          className="bg-[#800000] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#a00000] hover:scale-105 transition-transform duration-200 max-w-xs mx-auto mb-4"
        >
          Continue
        </button>

        <p className="text-sm text-gray-600 mb-6">
          Didn’t receive a code?{" "}
          <span className="text-[#800000] cursor-pointer font-medium">Resend</span>
        </p>

        <div className="flex items-center justify-center text-sm gap-2 text-[#800000] font-semibold">
          <Link to="/login" className="hover:text-[#a00000] transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmation;
