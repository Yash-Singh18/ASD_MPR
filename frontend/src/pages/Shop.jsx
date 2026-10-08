import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Shop({ onCartChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(null);

  useEffect(() => {
    api.categories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      api
        .products({ q, category_id: categoryId })
        .then(setProducts)
        .catch((e) => setError(e.message));
    }, 200);
    return () => clearTimeout(t);
  }, [q, categoryId]);

  async function add(p) {
    try {
      await api.addToCart(p.id);
      setAdded(p.id);
      setTimeout(() => setAdded(null), 800);
      onCartChange();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <div className="banner">Groceries delivered in 10 minutes (not really, it is all fake)</div>
      <div className="toolbar">
        <input placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <div className="emoji">{p.emoji}</div>
            <h3>{p.name}</h3>
            <small>{p.category?.name || "Uncategorised"}</small>
            <p className="desc">{p.description}</p>
            <div className="row">
              <strong>${Number(p.price).toFixed(2)}</strong>
              <button disabled={p.stock === 0} onClick={() => add(p)}>
                {p.stock === 0 ? "Sold out" : added === p.id ? "Added ✓" : "Add"}
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && !error && <p>No products found.</p>}
      </div>
    </>
  );
}
