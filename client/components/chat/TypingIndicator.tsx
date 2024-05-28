import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="bg-gray-500 p-2 rounded-full animate-pulse"></div>
      <div className="bg-gray-500 p-2 rounded-full animate-pulse delay-150"></div>
      <div className="bg-gray-500 p-2 rounded-full animate-pulse delay-300"></div>
    </div>
  );
};

export default TypingIndicator;
