"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState<any[]>([]);

  const handleStatusChange = (id: number) => {
    console.log("changed the status");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9090/product/bought-by-user"
        );
        setPurchases(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">All Purchases</h1>
      <div>
        {purchases.map((purchase, index) => (
          <div key={index} className="border p-4 rounded shadow mb-4">
            <div className="mb-4">
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
            </div>
            <hr className="my-4" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Products Bought</h2>
              {purchase.purchases.map((product: any, productIndex: number) => (
                <div key={productIndex} className="mb-2">
                  <p>
                    <strong>ID:</strong> {product.id || "N/A"}
                  </p>
                  <p>
                    <strong>Title:</strong> {product.title || "N/A"}
                  </p>
                  <p className="status-container">
                    <strong>Status:</strong> {product.status}{" "}
                    {/* <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-md ml-4"
                      onClick={() => handleStatusChange(product.id)}
                    >
                      Change Status
                    </button> */}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesPage;
