const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
    } catch {}
    throw new Error(detail);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  categories: () => request("/categories"),
  createCategory: (name) => request("/categories", { method: "POST", body: { name } }),
  updateCategory: (id, name) => request(`/categories/${id}`, { method: "PUT", body: { name } }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  products: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null));
    return request(`/products?${qs}`);
  },
  createProduct: (body) => request("/products", { method: "POST", body }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: "PUT", body }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  cart: () => request("/cart"),
  addToCart: (product_id, quantity = 1) =>
    request("/cart/items", { method: "POST", body: { product_id, quantity } }),
  setCartQty: (id, quantity) => request(`/cart/items/${id}`, { method: "PUT", body: { quantity } }),
  removeCartItem: (id) => request(`/cart/items/${id}`, { method: "DELETE" }),

  checkout: (body) => request("/orders/checkout", { method: "POST", body }),
  orders: () => request("/orders"),
  setOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: "PUT", body: { status } }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
};
