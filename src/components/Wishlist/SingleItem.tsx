import React from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleB2BRemoveFromWishlist } from "@/lib/helpers/wishlistHelpers";
import { addToCartAsync } from "@/redux/features/cart-slice";
import Image from "next/image";

const SingleItem = ({ item }: { item: any }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromWishlist = () => {
    handleB2BRemoveFromWishlist({
      dispatch,
      wishlistId: item.id,
    });
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCartAsync({
          ...item,
          id: item.productId, 
          quantity: item.minimum_order_quantity || 1,
        })
      ).unwrap();
      toast.success("Item added to cart");
    } catch (error: any) {
      toast.error(error || "Failed to add item to cart");
    }
  };

  // const isInStock = item.stock > 0 || item.inStock === true; 

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-2 transition-shadow hover:shadow-md">
      
      {/* Product Info Left Side */}
      <div className="flex items-center gap-5 flex-1">
        <a href={`/products/${item.slug || item.id}`} className="block shrink-0">
          <div className="flex items-center justify-center rounded-xl bg-gray-1 max-w-[100px] w-full h-[100px] shrink-0 overflow-hidden group">
            {item.imgs?.thumbnails?.[0] ? (
              <Image
                src={item.imgs.thumbnails[0]}
                alt={item.title || "product"}
                width={200}
                height={200}
                unoptimized
                className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-4">
                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </a>

        <div className="flex flex-col flex-1">
          <a href={`/products/${item.slug || item.id}`} className="inline-block group">
            <h3 className="text-lg font-semibold text-dark ease-out duration-200 group-hover:text-blue line-clamp-2">
              {item.title}
            </h3>
          </a>
          <p className="text-gray-5 mt-1 font-medium">${Number(item.discountedPrice ?? item.price).toFixed(2)}</p>
          
          {/* Mobile-only layout gap */}
          <div className="sm:hidden mt-4 flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              className="inline-flex flex-1 justify-center items-center text-white bg-blue py-2.5 px-5 rounded-xl ease-out duration-200 hover:bg-blue-dark hover:shadow-lg disabled:opacity-50 text-sm font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={handleRemoveFromWishlist}
              aria-label="Remove product from wishlist"
              className="flex items-center justify-center w-11 h-11 rounded-xl text-gray-4 hover:bg-red-light-6 hover:text-red transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Actions Right Side */}
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <button
          onClick={handleAddToCart}
          className="inline-flex text-white bg-blue border border-transparent py-2.5 px-6 rounded-xl ease-out duration-200 hover:bg-blue-dark hover:shadow-[0px_8px_16px_rgba(64,135,42,0.15)] disabled:opacity-50 transition-all font-medium"
        >
          Add to Cart
        </button>
        
        <button
          onClick={handleRemoveFromWishlist}
          aria-label="Remove product from wishlist"
          className="flex items-center justify-center w-11 h-11 rounded-xl text-gray-4 hover:bg-red-light-6 hover:text-red transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
    </div>
  );
};

export default SingleItem;