import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/your-image.png"; // عدلي المسار حسب الصورة

const ResetSuccess = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-white rounded-[2.5rem] shadow-lg border border-gray-200 px-10 py-12 w-full max-w-md text-center">
        <FiCheckCircle className="mx-auto text-[#800000] mb-4 animate-bounce" size={50} />
        <h2 className="text-2xl font-bold text-black mb-2">Password reset successful</h2>
        <p className="text-gray-600 mb-8">
          Your password has been changed successfully. You can now log in with your new password.
        </p>

        <Link
          to="/loginregister"
          className="bg-[#800000] hover:bg-[#a00000] text-white font-semibold py-2 px-6 rounded-full text-sm transition-transform duration-200 hover:scale-105 mx-auto block w-fit"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default ResetSuccess;
