import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">FashionHub Admin</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-gray-700 font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;