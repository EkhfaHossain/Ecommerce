"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { parseCookies } from "nookies";
import LogoutButton from "./LogoutButton";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = parseCookies().token; // Get specific cookie value
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoggedIn();

    const interval = setInterval(checkLoggedIn, 1000);

    return () => clearInterval(interval);
  }, [parseCookies().token]);

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link href="/" passHref>
          <div className="btn btn-ghost text-xl">Ecommerce</div>
        </Link>
      </div>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
              viewBox="0 0 29 29"
              id="user"
            >
              <path d="M14.5 2A12.514 12.514 0 0 0 2 14.5 12.521 12.521 0 0 0 14.5 27a12.5 12.5 0 0 0 0-25Zm7.603 19.713a8.48 8.48 0 0 0-15.199.008A10.367 10.367 0 0 1 4 14.5a10.5 10.5 0 0 1 21 0 10.368 10.368 0 0 1-2.897 7.213ZM14.5 7a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 14.5 7Z"></path>
            </svg>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/products/create" passHref>
                  <div className="justify-between">
                    Add Product
                    <span className="badge"> new </span>
                  </div>
                </Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          ) : (
            <li>
              <Link href="/user/registration/login" passHref>
                <div className="justify-between">Sign In</div>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
