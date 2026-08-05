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
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      {/* Remove button */}
      <div className="min-w-[83px]">
        <button
          onClick={handleRemoveFromWishlist}
          aria-label="Remove product from wishlist"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.19509 8.22222C8.92661 7.95374 8.49131 7.95374 8.22282 8.22222C7.95433 8.49071 7.95433 8.92601 8.22282 9.1945L10.0284 11L8.22284 12.8056C7.95435 13.074 7.95435 13.5093 8.22284 13.7778C8.49133 14.0463 8.92663 14.0463 9.19511 13.7778L11.0006 11.9723L12.8061 13.7778C13.0746 14.0463 13.5099 14.0463 13.7784 13.7778C14.0469 13.5093 14.0469 13.074 13.7784 12.8055L11.9729 11L13.7784 9.19451C14.0469 8.92603 14.0469 8.49073 13.7784 8.22224C13.5099 7.95376 13.0746 7.95376 12.8062 8.22224L11.0006 10.0278L9.19509 8.22222Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0007 1.14587C5.55835 1.14587 1.14648 5.55773 1.14648 11C1.14648 16.4423 5.55835 20.8542 11.0007 20.8542C16.443 20.8542 20.8548 16.4423 20.8548 11C20.8548 5.55773 16.443 1.14587 11.0007 1.14587ZM2.52148 11C2.52148 6.31713 6.31774 2.52087 11.0007 2.52087C15.6836 2.52087 19.4798 6.31713 19.4798 11C19.4798 15.683 15.6836 19.4792 11.0007 19.4792C6.31774 19.4792 2.52148 15.683 2.52148 11Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* Product */}
      <div className="min-w-[387px]">
        <div className="flex items-center gap-5.5">
          <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5 shrink-0">
            {item.imgs?.thumbnails?.[0] ? (
              <Image
                src={item.imgs.thumbnails[0]}
                alt={item.title || "product"}
                width={200}
                height={200}
                unoptimized
                className="object-contain max-h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-5">
                {/* fallback svg */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M35 30C35 30.663 34.7366 31.2989 34.2678 31.7678C33.7989 32.2366 33.163 32.5 32.5 32.5H7.5C6.83696 32.5 6.20107 32.2366 5.73223 31.7678C5.26339 31.2989 5 30.663 5 30V10C5 9.33696 5.26339 8.70107 5.73223 8.23223C6.20107 7.76339 6.83696 7.5 7.5 7.5H12.5L15 5H25L27.5 7.5H32.5C33.163 7.5 33.7989 7.76339 34.2678 8.23223C34.7366 8.70107 35 9.33696 35 10V30Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 27.5C23.4518 27.5 26.25 24.7018 26.25 21.25C26.25 17.7982 23.4518 15 20 15C16.5482 15 13.75 17.7982 13.75 21.25C13.75 24.7018 16.5482 27.5 20 27.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-dark ease-out duration-200 hover:text-blue">
              <a href={`/products/${item.slug || item.id}`}>{item.title}</a>
            </h3>
          </div>
        </div>
      </div>

      {/* Unit Price */}
      <div className="min-w-[205px]">
        <p className="text-dark">${Number(item.discountedPrice ?? item.price).toFixed(2)}</p>
      </div>

      {/* Stock Status */}
      {/* <div className="min-w-[265px]">
        {isInStock ? (
          <div className="flex items-center gap-1.5">
            <span className="text-green">In Stock</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"> 
            </svg>
            <span className="text-red">Out of Stock</span>
          </div>
        )}
      </div> */}

      {/* Action */}
      <div className="min-w-[150px] flex justify-end">
        <button
          onClick={handleAddToCart}
          // disabled={!isInStock}
          className="inline-flex text-dark hover:text-white bg-gray-1 border border-gray-3 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:border-gray-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-1 disabled:hover:text-dark"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleItem;