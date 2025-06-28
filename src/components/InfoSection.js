import React from 'react';
import { FaHeadset, FaMoneyBillWave, FaTag, FaLock } from 'react-icons/fa';

const InfoSection = () => {
  const infoItems = [
    {
      icon: <FaHeadset className="text-3xl text-red-800" />,
      title: 'Support 24/7',
      description: 'We are here to assist you anytime',
    },
    {
      icon: <FaMoneyBillWave className="text-3xl text-red-800" />,
      title: '100% Money Back',
      description: 'Full refund if you are not satisfied',
    },
    {
      icon: <FaTag className="text-3xl text-red-800" />,
      title: 'Discount',
      description: 'Enjoy the best prices on our products',
    },
    {
      icon: <FaLock className="text-3xl text-red-800" />,
      title: 'Payment Secure',
      description: 'Your payment information is safe with us',
    },
  ];

  return (
    <div className="bg-white pb-8 pt-12">
      <div className="container mt-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            {item.icon}
            <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
