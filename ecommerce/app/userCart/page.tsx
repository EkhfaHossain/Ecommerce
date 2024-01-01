"use client";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart: Product[] = JSON.parse(storedCart);
      setCart(parsedCart);
    }
  }, []);

  const increaseQuantity = (productId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (productId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: item.quantity > 1 ? item.quantity - 1 : 1,
          }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = (item: Product) => {
    return (item.price * item.quantity).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
              <span className="font-bold">Product</span>
              <span className="font-bold">Quantity</span>
              <span className="font-bold">Price</span>
              <span className="font-bold">Total Price</span>
              <span className="font-bold">Actions</span>
            </div>
          </div>
          <div>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-4"
              >
                <span>{item.title}</span>
                <div className="flex items-center mt-4 justify-center">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    className="text-sm bg-gray-200 py-1 px-2 rounded-l focus:outline-none"
                  >
                    -
                  </button>
                  <span className="px-1">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    className="text-sm bg-gray-200 py-1 px-2 rounded-r focus:outline-none"
                  >
                    +
                  </button>
                </div>
                <span>${item.price}</span>
                <span>${totalPrice(item)}</span>
                <button
                  className="text-red-500"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
