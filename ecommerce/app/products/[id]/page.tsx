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
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const increaseQuantity = () => {
    setSelectedQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setSelectedQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : 1
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (params.id) {
          const response = await axios.get(
            `http://localhost:9090/products/${params.id}`,
            { withCredentials: true }
          );
          setProduct(response.data);
          console.log(response.data);
        }

        await fetchUserData();
      } catch (error) {
        console.error("Error fetching product or user data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const fetchUserData = async () => {
    try {
      const token = parseCookies().token;
      setIsLoggedIn(!!token);

      if (!token) {
        return;
      }

      const userProfileResponse = await axios.get(
        `http://localhost:9090/user-profile`,
        { withCredentials: true }
      );

      const userRole = userProfileResponse.data?.role;
      console.log(userRole);

      if (userRole === "admin") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (product && product.id) {
        const deleteProduct = await axios.delete(
          `http://localhost:9090/product/delete/${product.id}`,
          {
            withCredentials: true,
          }
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

  const handleBuy = async () => {
    try {
      const userProfileResponse = await axios.get(
        `http://localhost:9090/user-profile`,
        { withCredentials: true }
      );

      const userId = userProfileResponse.data?.id;
      //console.log(userId);

      if (!userId) {
        console.error("User ID not found");
        return;
      }
      //console.log(selectedQuantity);
      const buyProduct = await axios.post(
        `http://localhost:9090/product/buy/${params.id}`,
        { userId, quantity: selectedQuantity },
        { withCredentials: true }
      );

      console.log("Product purchased successfully");
    } catch (error) {
      console.error("Error purchasing product:", error);
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

                    <p className="mt-2 text-lg">Price: ${product.price}</p>
                    <div className="flex items-center mt-4 justify-center">
                      <button
                        onClick={decreaseQuantity}
                        className="text-sm bg-gray-200 py-1 px-2 rounded-l focus:outline-none"
                      >
                        -
                      </button>
                      <span className="px-2">{selectedQuantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="text-sm bg-gray-200 py-1 px-2 rounded-r focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    {isLoggedIn && isAdmin && (
                      <>
                        <Link href={`/products/update/${product.id}`} passHref>
                          <button className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md">
                            Update
                          </button>
                        </Link>

                        <button
                          className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md"
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between">
                    {isLoggedIn && !isAdmin && (
                      <>
                        <button
                          className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md"
                          onClick={handleBuy}
                        >
                          Buy Now
                        </button>
                        <button
                          className="px-4 mt-4 bg-buttonColor hover:bg-buttonColor text-white py-2 px-4 rounded-md shadow-md"
                          //onClick={handleBuy}
                        >
                          Add to Cart
                        </button>
                      </>
                    )}
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
