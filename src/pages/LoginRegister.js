import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../index.css";
import loginBg from "../assets/images/your-image.png";
import { Link, useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("user");

  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpUserName, setSignUpUserName] = useState("");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Message states
  const [signInMessage, setSignInMessage] = useState("");
  const [signUpMessage, setSignUpMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success", "error", "info"

  const navigate = useNavigate();

  const inputFieldStyle =
    "w-full mb-3 px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800";

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return null;
    }
  };

  const handleUserRedirection = (token) => {
    const decoded = parseJwt(token);
    const role =
      decoded?.role ||
      decoded?.Role ||
      decoded?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ||
      decoded?.[
        "https://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    const status =
      decoded?.status ||
      decoded?.Status ||
      decoded?.accountStatus ||
      decoded?.AccountStatus ||
      decoded?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/status"
      ] ||
      decoded?.[
        "https://schemas.microsoft.com/ws/2008/06/identity/claims/status"
      ];
    const hasRequest =
      decoded?.hasRequest ||
      decoded?.HasRequest ||
      decoded?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/hasRequest"
      ] ||
      decoded?.[
        "https://schemas.microsoft.com/ws/2008/06/identity/claims/hasRequest"
      ];

    let normalizedRole =
      typeof role === "number"
        ? role.toString()
        : (role || "").toLowerCase().trim();
    let normalizedStatus =
      typeof status === "string" ? status.toLowerCase().trim() : "";
    let hasRequestBoolean =
      typeof hasRequest === "boolean"
        ? hasRequest
        : (hasRequest || "").toLowerCase() === "true";

    if (
      hasRequestBoolean &&
      (normalizedRole === "3" || normalizedRole === "pending")
    ) {
      setSignInMessage(
        "You have a pending store request. Please wait for approval."
      );
      setMessageType("info");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    if (normalizedRole === "3" || normalizedRole === "pending") {
      setSignInMessage(
        "Your account is pending approval. Redirecting to seller dashboard..."
      );
      setMessageType("info");
      setTimeout(() => navigate("/dashboard-seller"), 2000);
      return;
    }

    if (normalizedRole === "1" || normalizedRole === "seller") {
      setSignInMessage("Welcome Seller! Redirecting to your dashboard...");
      setMessageType("success");
      setTimeout(() => navigate("/dashboard-seller"), 2000);
    } else if (normalizedRole === "2" || normalizedRole === "admin") {
      setSignInMessage("Welcome Admin! Redirecting to admin dashboard...");
      setMessageType("success");
      setTimeout(() => navigate("/admin-dashboard"), 2000);
    } else {
      setSignInMessage("Welcome User! Redirecting to home...");
      setMessageType("success");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  const handleSignUp = async () => {
    setSignUpMessage("");

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    if (
      !signUpFirstName ||
      !signUpLastName ||
      !signUpEmail ||
      !signUpPassword ||
      !signUpUserName
    ) {
      setSignUpMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FirstName: signUpFirstName,
            LastName: signUpLastName,
            UserName: signUpUserName,
            Email: signUpEmail,
            Password: signUpPassword,
            Role: userType === "user" ? 0 : 1,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          setSignUpMessage("Registration successful! Redirecting...");
          setMessageType("success");
          setTimeout(() => handleUserRedirection(data.token), 1500);
        } else {
          setSignUpMessage(
            "Registration successful! Please check your email for verification."
          );
          setMessageType("success");
          setTimeout(() => navigate("/verify-notice"), 2000);
        }
      } else {
        if (data?.message) {
          if (data.message.includes("Email")) {
            setSignUpMessage(
              "This email is already registered. Please use a different email."
            );
          } else if (data.message.includes("Username")) {
            setSignUpMessage(
              "This username is already taken. Please choose a different one."
            );
          } else {
            setSignUpMessage(data.message);
          }
        } else {
          setSignUpMessage("Registration failed. Please try again.");
        }
        setMessageType("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSignUpMessage(
        "Network error. Please check your connection and try again."
      );
      setMessageType("error");
    }
  };

  const handleSignIn = async () => {
    setSignInMessage("");

    if (!signInEmail || !signInPassword) {
      setSignInMessage("Please enter both email and password");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Email: signInEmail,
            Password: signInPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        setSignInMessage("Login successful! Redirecting...");
        setMessageType("success");
        setTimeout(() => handleUserRedirection(data.token), 1500);
      } else {
        if (data?.message) {
          if (data.message.includes("email")) {
            setSignInMessage(
              "Invalid email address. Please check and try again."
            );
          } else if (data.message.includes("password")) {
            setSignInMessage("Incorrect password. Please try again.");
          } else {
            setSignInMessage(data.message);
          }
        } else {
          setSignInMessage(
            "Invalid email or password. Please check your credentials."
          );
        }
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login error:", error);
      setSignInMessage(
        "Invalid email or password. Please check your credentials."
      );
      setMessageType("error");
    }
  };

  const getMessageStyle = (type) => {
    const baseStyle =
      "text-center text-sm mb-4 p-2 rounded-md transition-all duration-300";
    switch (type) {
      case "success":
        return `${baseStyle} bg-green-100 text-green-700 border border-green-300`;
      case "error":
        return `${baseStyle} bg-red-100 text-red-700 border border-red-300`;
      case "info":
        return `${baseStyle} bg-blue-100 text-blue-700 border border-blue-300`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow flex items-center justify-center bg-cover bg-center h-screen">
        <div className="w-[950px] h-[550px] bg-white shadow-2xl rounded-[100px] flex overflow-hidden relative transition-all duration-700">
          {/* Sign In */}
          <div
            className={`w-1/2 p-10 mt-[70px] absolute top-0 h-full transition-all duration-700 ${
              isSignIn
                ? "translate-x-0 opacity-100 z-20"
                : "-translate-x-full opacity-0 z-0 pointer-events-none"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>

            {signInMessage && (
              <div className={getMessageStyle(messageType)}>
                {signInMessage}
              </div>
            )}

            <input
              type="email"
              placeholder="Email"
              className={inputFieldStyle}
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showSignInPassword ? "text" : "password"}
                placeholder="Password"
                className={inputFieldStyle}
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
              <span
                onClick={() => setShowSignInPassword(!showSignInPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-800 cursor-pointer"
              >
                {showSignInPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="text-center mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-red-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              onClick={handleSignIn}
              className="bg-red-800 hover:bg-red-700 w-[200px] py-2 text-sm mx-auto block rounded-full text-white transition-all duration-300 hover:scale-105"
            >
              SIGN IN
            </button>
          </div>

          {/* Sign Up */}
          <div
            className={`w-1/2 p-10 absolute top-0 right-0 h-full transition-all duration-700 ${
              !isSignIn
                ? "translate-x-0 opacity-100 z-20"
                : "translate-x-full opacity-0 z-0 pointer-events-none"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              Create Account
            </h2>

            {signUpMessage && (
              <div className={getMessageStyle(messageType)}>
                {signUpMessage}
              </div>
            )}

            <input
              type="text"
              placeholder="First Name"
              className={inputFieldStyle}
              value={signUpFirstName}
              onChange={(e) => setSignUpFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className={inputFieldStyle}
              value={signUpLastName}
              onChange={(e) => setSignUpLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className={inputFieldStyle}
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showSignUpPassword ? "text" : "password"}
                placeholder="Password"
                className={inputFieldStyle}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
              <span
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-800 cursor-pointer"
              >
                {showSignUpPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={inputFieldStyle}
                value={signUpConfirmPassword}
                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-800 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <input
              type="text"
              placeholder="Username"
              className={inputFieldStyle}
              value={signUpUserName}
              onChange={(e) => setSignUpUserName(e.target.value)}
            />
            <div className="flex justify-center items-center gap-6 mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={userType === "user"}
                  onChange={() => setUserType("user")}
                  className="accent-red-800"
                />
                User
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="userType"
                  value="seller"
                  checked={userType === "seller"}
                  onChange={() => setUserType("seller")}
                  className="accent-red-800"
                />
                Seller
              </label>
            </div>
            <button
              onClick={handleSignUp}
              className="bg-red-800 hover:bg-red-700 w-[200px] py-2 text-sm mx-auto block mt-2 rounded-full text-white transition-all duration-300 hover:scale-105"
            >
              SIGN UP
            </button>
          </div>

          {/* Overlay */}
          <div
            className={`absolute top-0 bottom-0 w-1/2 flex items-center justify-center bg-red-800 text-white px-8 transition-all duration-700 z-10 ${
              isSignIn
                ? "left-1/2 rounded-tl-[100px] rounded-bl-[100px]"
                : "left-0 rounded-tr-[100px] rounded-br-[100px]"
            }`}
          >
            <div className="text-center transition-all duration-500 max-w-[80%]">
              <h2 className="text-3xl font-bold mb-3">
                {isSignIn ? "Hello, User!" : "Welcome, User!"}
              </h2>
              <p className="mb-6 text-sm">
                {isSignIn
                  ? "If you don't have an account, sign up now and start your journey!"
                  : "Already have an account? Sign in to continue."}
              </p>
              <button
                className="text-sm text-white hover:underline"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setSignInMessage("");
                  setSignUpMessage("");
                }}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginRegister;
