import React from 'react';

const ServiceCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-base text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;