import React from 'react';

const Preloader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-sky-200">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-sky-600"></div>
    </div>
  );
};

export default Preloader;