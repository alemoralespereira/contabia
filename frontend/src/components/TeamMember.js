import React from 'react';

const TeamMember = ({ name, role, image, bio }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-lg font-medium text-gray-900">{name}</h4>
      <p className="text-sm text-blue-600 mb-2">{role}</p>
      <p className="text-gray-500 text-center">{bio}</p>
    </div>
  );
};

export default TeamMember;