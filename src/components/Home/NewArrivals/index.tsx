"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { useProducts } from "@/hooks/useProducts";
import PreLoader from "@/components/Common/PreLoader";

const NewArrival = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { products, loading, totalPages } = useProducts({
    page: currentPage,
    perPage: itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section className="overflow-hidden pt-15 pb-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Products
            </h2>
          </div>

          <Link
            href="/product"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {/* <!-- New Arrivals item --> */}
          {loading ? (
            <PreLoader />
          ) : (
            products.map((item, key) => (
              <ProductItem item={item} key={key} />
            ))
          )}
        </div>

        {/* <!-- Products Pagination Start --> */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12.5">
            <div className="bg-white shadow-1 rounded-md p-2">
              <ul className="flex items-center gap-1">
                {/* Previous Button */}
                <li>
                  <button
                    onClick={handlePrevPage}
                    aria-label="button for pagination previous"
                    type="button"
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </li>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <li key={index}>
                    {typeof page === "number" ? (
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                          currentPage === page
                            ? "bg-blue text-white"
                            : "hover:text-white hover:bg-blue"
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span className="flex py-1.5 px-3.5">{page}</span>
                    )}
                  </li>
                ))}

                {/* Next Button */}
                <li>
                  <button
                    onClick={handleNextPage}
                    aria-label="button for pagination next"
                    type="button"
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrival;
