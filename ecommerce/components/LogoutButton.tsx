"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:9090/logout", null, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Logout successful");
        //router.push("/user/registration/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="cursor-pointer">
      Log Out
    </button>
  );
};

export default LogoutButton;
