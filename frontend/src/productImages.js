// Curated high-resolution professional photography for grocery products

export const EXACT_PRODUCT_IMAGES = {
  // Fruits & Vegetables
  "Banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  "Apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  "Tomato": "https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=600&q=80",
  "Onion": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=600&q=80",
  "Potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",

  // Dairy & Eggs
  "Milk 1L": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
  "Eggs (12)": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
  "Butter": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
  "Cheese Slices": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80",

  // Snacks
  "Potato Chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
  "Chocolate Bar": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  "Popcorn": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
  "Cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",

  // Beverages
  "Orange Juice": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
  "Cola": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
  "Green Tea": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80",
  "Coffee Beans": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",

  // Bakery
  "Bread Loaf": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  "Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  "Bagel": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
};

export const CATEGORY_FALLBACK_IMAGES = {
  "Fruits & Vegetables": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
  "Dairy & Eggs": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
  "Snacks": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
  "Beverages": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
  "Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
};

export const DEFAULT_GROCERY_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

// Keyword-based fallback matching for dynamic products
const KEYWORD_IMAGE_MAP = [
  { keywords: ["banana", "plantain"], url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["apple", "cider"], url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["tomato"], url: "https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["onion", "garlic", "shallot"], url: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["potato", "fries"], url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["milk", "dairy", "yogurt", "cream"], url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["egg", "eggs"], url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["butter"], url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["cheese"], url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["chip", "chips", "crisp", "nacho"], url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["chocolate", "candy", "cocoa"], url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["popcorn"], url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["cookie", "biscuit"], url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["orange", "citrus", "juice"], url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["cola", "soda", "coke", "drink", "carbonated"], url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["tea", "matcha", "chai"], url: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["coffee", "espresso", "latte", "cappuccino"], url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["bread", "toast", "bun"], url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["croissant", "pastry"], url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["bagel"], url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["fruit", "berry", "strawberry", "grape"], url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80" },
  { keywords: ["vegetable", "greens", "salad"], url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" },
];

export function getProductImageUrl(product) {
  if (!product) return DEFAULT_GROCERY_IMAGE;

  // 1. If product has its own custom image_url
  if (product.image_url) return product.image_url;

  // 2. Exact name match
  if (EXACT_PRODUCT_IMAGES[product.name]) {
    return EXACT_PRODUCT_IMAGES[product.name];
  }

  // 3. Keyword match based on name or description
  const searchStr = `${product.name || ""} ${product.description || ""}`.toLowerCase();
  for (const item of KEYWORD_IMAGE_MAP) {
    if (item.keywords.some((kw) => searchStr.includes(kw))) {
      return item.url;
    }
  }

  // 4. Category fallback
  const categoryName = product.category?.name || product.category;
  if (categoryName && CATEGORY_FALLBACK_IMAGES[categoryName]) {
    return CATEGORY_FALLBACK_IMAGES[categoryName];
  }

  // 5. Ultimate grocery photo fallback
  return DEFAULT_GROCERY_IMAGE;
}
