"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9090/product/bought-by-user"
        );
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">All Purchases</h1>
      <div className="grid grid-cols-2 gap-4">
        {purchases.map((purchase, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Customer</h2>
            <p>
              <strong>ID:</strong> {purchase.customer.id}
            </p>
            <p>
              <strong>Name:</strong> {purchase.customer.name}
            </p>
            <p>
              <strong>Email:</strong> {purchase.customer.email}
            </p>
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Product</h2>
            <p>
              <strong>ID:</strong> {purchase.product.id}
            </p>
            <p>
              <strong>Name:</strong> {purchase.product.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesPage;
