"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
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
              key={product.id}
              className="md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 w-full px-4"
            >
              <Link href={`/products/${product.id}`} passHref>
                <div className="overflow-hidden rounded-lg shadow-lg border border-borderColor">
                  <div className="p-6 flex flex-col justify-between">
                    <h2 className="text-xl font-semibold">{product.id}</h2>
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p className="mt-2 text-md">
                      Category: {product.categories}
                    </p>
                    <p className="mt-2 text-lg">{product.description}</p>
                    <p className="mt-2 text-lg font-semibold">
                      ${product.price}
                    </p>

                    <button className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md self-end">
                      Buy Now
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
