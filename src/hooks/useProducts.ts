import { useState, useEffect } from "react";
import { getB2BCatalog } from "@/lib/api/b2b-api";
import { Product } from "@/types/product";
import { mapProductImages } from "@/lib/helpers/productHelpers";

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
            slug: item.slug, // Added slug for product details fetching
            title: item.title,
            reviews: 5, // Default reviews
            price: item.standard_price,
            discountedPrice: item.trade_price,
            has_volume_discounts: item.has_volume_discounts,
            minimum_order_quantity: item.minimum_order_quantity,
            volume_discounts: item.volume_discounts,
            standard_price: item.standard_price, // Keep original B2B fields
            trade_price: item.trade_price,
            category: item.category,
            description: item.description,
            imgs: mapProductImages(item),
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        // console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
