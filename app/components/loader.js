import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 h-screen w-full">
      <div className="relative">
        {/* Main loading circle */}
        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Inner pulse circle */}
        <div className="absolute top-0 left-0 w-24 h-24 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="text-xl font-bold text-white mb-2">Loading</div>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
        
        {/* Orbit circles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-3 h-3 bg-indigo-400 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-3 h-3 bg-purple-400 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 w-3 h-3 bg-cyan-400 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }}>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 w-3 h-3 bg-teal-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
