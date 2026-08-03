import { useState, useEffect } from "react";
import { getB2BCatalog } from "@/lib/api/b2b-api";
import { Product } from "@/types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getB2BCatalog(undefined, 1);
        if (data && data.data) {
          const mappedProducts: Product[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            reviews: 5, // Default reviews
            price: item.standard_price,
            discountedPrice: item.trade_price,
            imgs: {
              thumbnails: item.images && item.images.length > 0 
                ? item.images.map((img: string) => `http://localhost:8000/storage/${img}`) 
                : ["/images/hero/hero-01.png"],
              previews: item.images && item.images.length > 0 
                ? item.images.map((img: string) => `http://localhost:8000/storage/${img}`) 
                : ["/images/hero/hero-01.png"],
            }
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
