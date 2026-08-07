import { useState, useEffect } from "react";
import { getB2BCatalog, B2BCatalogParams } from "@/lib/api/b2b-api";
import { Product } from "@/types/product";
import { mapProductImages } from "@/lib/helpers/productHelpers";

const mapItem = (item: any): Product => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  reviews: 5,
  price: item.standard_price,
  discountedPrice: item.trade_price,
  has_volume_discounts: item.has_volume_discounts,
  minimum_order_quantity: item.minimum_order_quantity,
  volume_discounts: item.volume_discounts,
  standard_price: item.standard_price,
  trade_price: item.trade_price,
  category: item.category,
  description: item.description,
  imgs: mapProductImages(item),
});

export interface UseProductsOptions {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const useProducts = (
  options: UseProductsOptions | number = 1,
  perPage?: number,
  search?: string
) => {
  const params: UseProductsOptions =
    typeof options === "number"
      ? { page: options, perPage, search }
      : options || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const currentPage = params.page || 1;
  const currentPerPage = params.perPage;
  const currentSearch = params.search;
  const currentCategory = params.category;
  const currentSort = params.sort;
  const currentMinPrice = params.minPrice;
  const currentMaxPrice = params.maxPrice;

  useEffect(() => {
    let cancelled = false;

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const data = await getB2BCatalog({
          page: currentPage,
          perPage: currentPerPage,
          search: currentSearch,
          category: currentCategory,
          sort: currentSort,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
        });

        const rawItems = Array.isArray(data) ? data : data?.data || [];
        if (!cancelled) {
          setProducts(rawItems.map(mapItem));
          setTotalPages(!Array.isArray(data) && data?.last_page ? data.last_page : 1);
          setTotalCount(!Array.isArray(data) && data?.total ? data.total : rawItems.length);
        }
      } catch (error) {
        // console.error("Failed to fetch products:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCatalog();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    currentPerPage,
    currentSearch,
    currentCategory,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
  ]);

  return { products, loading, totalPages, totalCount };
};
