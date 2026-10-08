import { useEffect, useState } from "react";
import { api } from "../api.js";
import { getProductImageUrl, DEFAULT_GROCERY_IMAGE } from "../productImages.js";

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
      <div className="banner">
        <div className="hero-tag">⚡ Ultra-Fast Delivery in 10 Mins</div>
        <h1>Fresh Groceries, Delivered Fast</h1>
        <p>Premium farm-fresh produce, dairy, bakery essentials, and pantry snacks at everyday low prices.</p>
      </div>

      <div className="toolbar">
        <input 
          placeholder="Search fresh fruits, dairy, snacks, drinks..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All Categories ({products.length} products)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error}
        </p>
      )}

      <div className="grid">
        {products.map((p) => {
          const imgSrc = getProductImageUrl(p);
          return (
            <div className="card" key={p.id}>
              <div className="card-image-wrapper">
                <img 
                  src={imgSrc} 
                  alt={p.name} 
                  className="card-image" 
                  loading="lazy" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_GROCERY_IMAGE;
                  }}
                />
                <span className="card-badge" title={p.category?.name || "Grocery"}>
                  {p.emoji || "🛒"}
                </span>
              </div>

              <div className="card-content">
                <small>{p.category?.name || "Pantry"}</small>
                <h3>{p.name}</h3>
                <span className={`stock-tag ${p.stock === 0 ? "out" : p.stock < 15 ? "low" : ""}`}>
                  {p.stock === 0 ? "Out of stock" : p.stock < 15 ? `Only ${p.stock} left in stock` : "In Stock"}
                </span>
                <p className="desc">{p.description || "Farm fresh & high quality ingredient."}</p>

                <div className="row">
                  <div className="price">${Number(p.price).toFixed(2)}</div>
                  <button 
                    disabled={p.stock === 0} 
                    onClick={() => add(p)}
                    className={added === p.id ? "secondary" : ""}
                  >
                    {p.stock === 0 ? "Sold out" : added === p.id ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Added
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {products.length === 0 && !error && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)", background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: "1rem" }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h2>No matching groceries found</h2>
            <p>Try adjusting your search terms or selecting another category.</p>
          </div>
        )}
      </div>
    </>
  );
}
