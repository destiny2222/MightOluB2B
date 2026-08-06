"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";

export const Wishlist = () => {
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);

  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden py-20 bg-[#F9FAFB] min-h-screen">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {wishlistItems.length > 0 ? (
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
              {wishlistItems.map((item, key) => (
                <SingleItem item={item} key={key} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-2 max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gray-1 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Your wishlist is empty</h3>
              <p className="text-gray-5 mb-8 text-center max-w-md">Looks like you haven't added anything to your wishlist yet. Explore our products and find something you love!</p>
              <a href="/products" className="bg-dark text-white px-8 py-3 rounded-xl hover:bg-dark/90 transition-colors font-medium">Browse Products</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
