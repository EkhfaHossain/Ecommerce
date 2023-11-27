import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-navColor py-5 shadow-lg">
      <div className="container max-w-screen-xl mx-auto px-3">
        <div className="flex flex-wrap items-center">
          <Link href="/" passHref>
            <div className="px-2 text-2xl font-mono text-white">Ecommerce</div>
          </Link>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="inline-block bg-white shadow-md hover:shadow-lg border border-borderColor rounded-md">
              <Link href="/products/create" passHref>
                <button className="px-4 py-2 text-gray-700 font-semibold hover:bg-borderColor hover:border-borderColor">
                  Add Product
                </button>
              </Link>
            </div>
            <div className="inline-block bg-white shadow-md hover:shadow-lg border border-borderColor rounded-md">
              <button className="px-4 py-2 text-gray-700 font-semibold hover:bg-borderColor hover:border-borderColor">
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
