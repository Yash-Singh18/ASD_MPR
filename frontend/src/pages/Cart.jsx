import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { getProductImageUrl, DEFAULT_GROCERY_IMAGE } from "../productImages.js";

export default function Cart({ onCartChange }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [form, setForm] = useState({ customer_name: "", address: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = () => api.cart().then(setCart).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  async function change(promise) {
    try {
      setCart(await promise);
      setError("");
      onCartChange();
    } catch (e) {
      setError(e.message);
    }
  }

  async function checkout(e) {
    e.preventDefault();
    try {
      await api.checkout(form);
      onCartChange();
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    }
  }

  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, marginBottom: "1rem" }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <h2>Your cart is empty</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Looks like you haven't added any groceries to your cart yet.</p>
        <button onClick={() => navigate("/")}>Start Shopping</button>
      </div>
    );
  }

  return (
    <>
      <h2>Your Cart ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items)</h2>
      {error && <p className="error">{error}</p>}
      
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((i) => (
            <tr key={i.id}>
              <td>
                <div className="product-cell">
                  <img 
                    src={getProductImageUrl(i.product)} 
                    alt={i.product.name} 
                    className="product-thumb" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_GROCERY_IMAGE;
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{i.product.name}</div>
                    <small style={{ color: "var(--text-muted)" }}>{i.product.emoji} {i.product.category?.name || "Grocery"}</small>
                  </div>
                </div>
              </td>
              <td>${Number(i.product.price).toFixed(2)}</td>
              <td>
                <button 
                  className="secondary" 
                  style={{ padding: "0.25rem 0.6rem" }}
                  onClick={() => i.quantity > 1 ? change(api.setCartQty(i.id, i.quantity - 1)) : change(api.removeCartItem(i.id))}
                >
                  −
                </button>
                <span className="qty">{i.quantity}</span>
                <button 
                  className="secondary" 
                  style={{ padding: "0.25rem 0.6rem" }}
                  onClick={() => change(api.setCartQty(i.id, i.quantity + 1))}
                >
                  +
                </button>
              </td>
              <td><strong>${(i.product.price * i.quantity).toFixed(2)}</strong></td>
              <td>
                <button className="danger" style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem" }} onClick={() => change(api.removeCartItem(i.id))}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
        <div style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", height: "fit-content" }}>
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Delivery (10 min express)</span>
            <span style={{ color: "var(--success)", fontWeight: 600 }}>FREE</span>
          </div>
          <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "1rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: "var(--brand)" }}>${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <form className="form" onSubmit={checkout} style={{ margin: 0 }}>
          <h3 style={{ marginTop: 0 }}>Delivery Details</h3>
          <input 
            required 
            placeholder="Full Name" 
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })} 
          />
          <input 
            required 
            placeholder="Delivery Street Address & Apt" 
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} 
          />
          <button type="submit" style={{ padding: "0.85rem 1.5rem", fontSize: "1rem" }}>
            Place Order (Simulated 10-min Delivery)
          </button>
        </form>
      </div>
    </>
  );
}
