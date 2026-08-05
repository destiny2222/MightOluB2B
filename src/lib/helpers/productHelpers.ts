export const normalizeProductImageUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return url;
  }
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Remove leading slash if any
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  
  // Check if it already starts with storage/
  if (cleanPath.startsWith("storage/")) {
    return `${apiBaseUrl}/${cleanPath}`;
  }
  return `${apiBaseUrl}/storage/${cleanPath}`;
};

export const mapProductImages = (item: any): { thumbnails: string[]; previews: string[] } => {
  if (!item) {
    return {
      thumbnails: ["/images/hero/hero-01.png"],
      previews: ["/images/hero/hero-01.png"],
    };
  }

  // If item already has mapped imgs structure
  if (item.imgs?.previews?.length > 0) {
    return {
      thumbnails: item.imgs.thumbnails || item.imgs.previews,
      previews: item.imgs.previews,
    };
  }

  const imagesList: string[] = [];

  // Helper to add normalized URL to images list
  const addUrl = (val: any) => {
    if (typeof val === "string" && val.trim()) {
      imagesList.push(normalizeProductImageUrl(val.trim()));
    } else if (val && typeof val === "object") {
      const urlStr = val.image_path || val.image || val.url || val.path;
      if (typeof urlStr === "string" && urlStr.trim()) {
        imagesList.push(normalizeProductImageUrl(urlStr.trim()));
      }
    }
  };

  // 1. Check item.image
  if (Array.isArray(item.image)) {
    item.image.forEach(addUrl);
  } else {
    addUrl(item.image);
  }

  // 2. Check item.product_image
  if (Array.isArray(item.product_image)) {
    item.product_image.forEach(addUrl);
  } else {
    addUrl(item.product_image);
  }

  // 3. Check item.product_images
  if (Array.isArray(item.product_images)) {
    item.product_images.forEach(addUrl);
  } else {
    addUrl(item.product_images);
  }

  // 4. Check item.images
  if (Array.isArray(item.images)) {
    item.images.forEach(addUrl);
  } else {
    addUrl(item.images);
  }

  // De-duplicate URLs
  const uniqueImages = Array.from(new Set(imagesList.filter(Boolean)));

  // Fallback to default if empty
  const finalImages = uniqueImages.length > 0 ? uniqueImages : ["/images/hero/hero-01.png"];

  return {
    thumbnails: finalImages,
    previews: finalImages,
  };
};
