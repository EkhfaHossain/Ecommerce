"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";

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
            <Card key={product.id}>
              <Link href={`/products/${product.id}`} passHref>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p className="mt-2 text-md">
                      Category: {product.categories}
                    </p>
                    <p className="mt-2 text-lg">
                      {product.description.substring(0, 25)}...
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      ${product.price}
                    </p>
                  </div>
                  <div className="self-end">
                    <button className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md">
                      Buy Now
                    </button>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
