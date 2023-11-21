import React from "react";

const Header = () => {
  return (
    <header className="bg-lightBlue py-5 shadow-md">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="px-6 text-2xl font-mono text-gray-700">Ecommerce</div>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="inline-block bg-white shadow-md hover:shadow-lg border border-borderColor rounded-md">
              <button className="px-4 py-2 text-gray-700 hover:bg-borderColor hover:border-borderColor">
                Add Product
              </button>
            </div>
            <div className="inline-block bg-white shadow-md hover:shadow-lg border border-borderColor rounded-md">
              <button className="px-4 py-2 text-gray-700 hover:bg-borderColor hover:border-borderColor">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
