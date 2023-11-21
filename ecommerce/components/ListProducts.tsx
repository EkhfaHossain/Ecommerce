"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  product_id: number;
  title: string;
  description: string;
  categories: string;
  price: number;
  quantity: number;
}

const ListProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/products`);
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-screen-xl container mx-auto px-4">
        <div className="md:flex-row -mx-4 flex flex-wrap">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="bg-white md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 w-full px-4"
            >
              <div className="overflow-hidden rounded-lg shadow-lg">
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                  <p className="mt-2 text-lg font-semibold">${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
