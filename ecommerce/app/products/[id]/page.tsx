"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@/components/Card";
import Link from "next/link";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";

interface Product {
  image: string;
  id: number;
  title: string;
  description: string;
  categories: string;
  price: number;
  quantity: number;
}

const SingleProduct = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    const token = parseCookies().token;
    setIsLoggedIn(!!token);
  }, [params.id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (product && product.id) {
        const deleteProduct = await axios.delete(
          `http://localhost:9090/product/delete/${product.id}`
        );
        console.log("Product deleted successfully");

        setProduct(null);

        setIsDeleting(false);

        setTimeout(() => {
          router.push(`/products/`);
        }, 1000);
      }
    } catch (error) {
      console.log("Error Deleting Product", error);
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-screen-xl container mx-auto px-4">
        <div className="md:flex-row -mx-4 flex justify-center items-center h-full">
          {product ? (
            <Card>
              <Link href={`/products/${product.id}`} passHref>
                <div className="flex flex-col h-full justify-between">
                  <div className="bg-sky-300">
                    <img
                      className="object-fill h-48 w-96"
                      src={"http://localhost:9090/images/" + product.image}
                    />
                  </div>

                  <div className="mt-4">
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p className="mt-2 text-md">
                      Category: {product.categories}
                    </p>
                    <p className="mt-2 text-lg">{product.description}</p>
                    <p className="mt-2 text-lg font-semibold">
                      ${product.price}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    {isLoggedIn ? (
                      <Link href={`/products/update/${product.id}`} passHref>
                        <button className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md">
                          Update
                        </button>
                      </Link>
                    ) : null}

                    {isLoggedIn ? (
                      <button
                        className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </Link>
            </Card>
          ) : (
            <p> Loading...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
