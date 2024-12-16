import React from 'react';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-red-500 text-6xl font-bold mb-4">ERROR</h1>
        <p className="text-black text-2xl">can't access this page.</p>
      </div>
    </div>
  );
}

export default ErrorPage;
