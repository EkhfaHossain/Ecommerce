"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  categories: string;
  price: number;
  quantity: number;
}

const SingleProduct = ({ params }: { params: { id: number } }) => {
  const [product, setProducts] = useState<Product | null>(null);

  useEffect(() => {
    const fetchSingleProducts = async () => {
      try {
        if (params.id) {
          const response = await axios.get(
            `http://localhost:9090/products/${params.id}`
          );
          setProducts(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchSingleProducts();
  }, [params.id]);

  return (
    <div>
      {product ? (
        <div>
          <h1>{product.title}</h1>
          <p>Category: {product.categories}</p>
          <p>Description: {product.description}</p>
          <p>Price: ${product.price}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SingleProduct;
