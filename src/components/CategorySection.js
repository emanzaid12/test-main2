import React from 'react';
import ManCategory from '../assets/images/man.jpg';
import WomanCategory from '../assets/images/woman.jpg';
import KidCategory from '../assets/images/kid.jpg';

const categories = [
  {
    title: 'Men',
    imageUrl: ManCategory,
  },
  {
    title: 'Women',
    imageUrl: WomanCategory,
  },
  {
    title: 'Kids',
    imageUrl: KidCategory,
  },
];

const CategorySection = () => {
  return (
    <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
      {categories.map((category, index) => (
        <div
          key={index}
          className="relative h-64 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
        >
          <img
            src={category.imageUrl}
            alt={category.title}
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-xl font-bold text-white">{category.title}</p>
            <p className="text-gray-300">View All</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;
