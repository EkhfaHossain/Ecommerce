"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

const CheckoutPage: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9090/product/checkout`,
          { withCredentials: true }
        );
        console.log(response.data);

        const productsMap = new Map<string, Product>();
        response.data.products.forEach((product: Product) => {
          if (productsMap.has(product.name)) {
            const existingProduct = productsMap.get(product.name);
            if (existingProduct) {
              existingProduct.quantity += product.quantity;
              productsMap.set(product.name, existingProduct);
            }
          } else {
            productsMap.set(product.name, { ...product });
          }
        });

        const aggregatedProducts = Array.from(productsMap.values());
        setCartProducts(aggregatedProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

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
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none">
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
