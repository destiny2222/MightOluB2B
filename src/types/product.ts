export type Product = {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  slug?: string; // Added for B2B product fetching
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  has_volume_discounts?: boolean;
  minimum_order_quantity?: number;
  volume_discounts?: {
    minimum_quantity: number;
    discount_percentage: number;
  }[];
  description?: string;
  specifications?: { key: string, value: string }[];
  // B2B-specific fields
  trade_price?: number;
  standard_price?: number;
  // Filter fields
  category?: string;
  tags?: string;
  availableSizes?: string[];
  availableColors?: string[];
  soldAmount?: number;
  availability?: boolean;
};
