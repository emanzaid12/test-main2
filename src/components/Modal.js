import React from "react";

const Modal = ({ isModelOpen, setIsModelOpen, children }) => {
  if (!isModelOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md md:max-w-lg lg:max-w-xl">
      
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold"
          onClick={() => setIsModelOpen(false)}
        >
          &times;
        </button>

       
        {children}
      </div>
    </div>
  );
};

export default Modal;