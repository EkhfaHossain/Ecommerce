"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@/components/Card";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  categories: string;
  price: number;
  quantity: number;
}

const SingleProduct = ({ params }: { params: { id: number } }) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        if (params.id) {
          const response = await axios.get(
            `http://localhost:9090/products/${params.id}`
          );
          setProduct(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchSingleProduct();
  }, [params.id]);

  return (
    <section className="py-12">
      <div className="max-w-screen-xl container mx-auto px-4">
        <div className="md:flex-row -mx-4 flex justify-center items-center h-full">
          {product ? (
            <Card>
              <Link href={`/products/${product.id}`} passHref>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p className="mt-2 text-md">
                      Category: {product.categories}
                    </p>
                    <p className="mt-2 text-lg">{product.description}</p>
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
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
