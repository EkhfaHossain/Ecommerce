"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { propagateServerField } from "next/dist/server/lib/render-server";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

const CheckoutPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (params.id) {
          const response = await axios.get(
            `http://localhost:9090/product/checkout/${params.id}`,
            { withCredentials: true }
          );
          console.log("Checkout Product:", response.data);

          const { product } = response.data;

          if (product && typeof product === "object") {
            setCartProducts([product]);
          } else {
            console.error("Invalid product data received:", product);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleConfirmPurchase = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9090/product/${params.id}/status`,
        { status: "processing" },
        { withCredentials: true }
      );

      console.log("Purchase confirmed successfully");
      router.push("/");
    } catch (error) {
      console.log("Error Purchasing Product", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
            <span className="font-bold">Product</span>
            <span className="font-bold">Quantity</span>
            <span className="font-bold">Price</span>
          </div>
        </div>
        <div>
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span>{product.name}</span>
              <span> {product.quantity}</span>
              <span>${product.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Total:</span>
          <span className="font-bold text-lg">
            $
            {cartProducts.reduce(
              (total, product) => total + product.price * product.quantity,
              0
            )}
          </span>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
            onClick={handleConfirmPurchase}
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
