"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Card from "@/components/Card";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import PriceFilter from "@/components/PriceFilter";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const predefinedCategories = [
    "Electronics",
    "Snacks",
    "Groceries",
    "Makeup",
    "Sports",
  ];

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleFilterChange = ({ min, max }: { min: number; max: number }) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchProducts = async (page: any) => {
      setIsLoading(true);
      try {
        let url = `http://localhost:9090/products?page=${page}`;
        if (minPrice !== "" && maxPrice !== "") {
          url += `&min=${minPrice}&max=${maxPrice}`;
        }
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }
        if (isLoggedIn && isAdmin && startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        console.log(url);
        const response = await axios.get(url);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
        await fetchUserData();
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts(currentPage);
  }, [
    currentPage,
    minPrice,
    maxPrice,
    selectedCategory,
    startDate,
    endDate,
    isLoggedIn,
    isAdmin,
  ]);

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

  return (
    <section className="py-4">
      <CategoryFilter
        categories={predefinedCategories}
        onCategoryChange={handleCategoryChange}
      />

      <PriceFilter
        onFilterChange={handleFilterChange}
        onFilterClear={handleClearFilters}
      />
      {isLoggedIn && isAdmin && (
        <div className="flex items-center justify-center mt-4">
          <input
            type="date"
            className="border-2 border-stone-500 rounded-lg p-2 mr-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border-2 border-stone-500 rounded-lg p-2 mr-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            //onClick={handleDateRangeChange}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Clear Date Range
          </button>
        </div>
      )}

      <div className="max-w-screen-xl container mx-auto px-4 mt-8">
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
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        {!isLoading && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default ListProducts;
