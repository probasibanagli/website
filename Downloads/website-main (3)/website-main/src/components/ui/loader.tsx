// components/ui/loader.tsx
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg font-semibold text-text-primary">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
