"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Card from "@/components/Card";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

interface Product {
  id: number;
  title: string;
  description: string;
  categories: string;
  price: number;
  quantity: number;
  image: File | null | string;
}

const ListProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async (page: any) => {
      try {
        const response = await axios.get(
          `http://localhost:9090/products?page=${page}`
        );
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-12">
      {/* <CategoryFilter /> */}
      <div className="max-w-screen-xl container mx-auto px-4">
        <div className="md:flex-row -mx-4 flex flex-wrap">
          {products.map((product) => (
            <Card key={product.id}>
              <Link href={`/products/${product.id}`} passHref>
                <div className="flex flex-col h-full justify-between">
                  <div className="bg-sky-300">
                    <img
                      className="object-fill h-48 w-96"
                      src={
                        product.image
                          ? "http://localhost:9090/images/" + product.image
                          : "http://localhost:9090/images/no-image.jpeg"
                      }
                    />
                  </div>

                  <div className="mt-4">
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
                  {/* <div className="self-end">
                    <button className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md">
                      Buy Now
                    </button>
                  </div> */}
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mb-10">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default ListProducts;
