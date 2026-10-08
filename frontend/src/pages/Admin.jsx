import { useEffect, useState } from "react";
import { api } from "../api.js";
import { getVehicleImageUrl, DEFAULT_VEHICLE_IMAGE } from "../vehicleImages.js";

const EMPTY = { name: "", description: "", emoji: "🚗", price: "", stock: 0, category_id: "" };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [catName, setCatName] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([api.products(), api.categories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  async function run(promise) {
    try {
      await promise;
      setError("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  function submitProduct(e) {
    e.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: form.category_id === "" ? null : Number(form.category_id),
    };
    run(editingId ? api.updateProduct(editingId, body) : api.createProduct(body)).then(() => {
      setForm(EMPTY);
      setEditingId(null);
    });
  }

  function edit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description, emoji: p.emoji,
      price: p.price, stock: p.stock, category_id: p.category_id ?? "",
    });
  }

  return (
    <>
      <h2>Fleet Admin</h2>
      {error && <p className="error">{error}</p>}

      <h3>Manage Vehicle Types</h3>
      <form className="form inline" onSubmit={(e) => { e.preventDefault(); run(api.createCategory(catName)); setCatName(""); }}>
        <input required placeholder="New vehicle type (e.g. Electric Scooters)" value={catName} onChange={(e) => setCatName(e.target.value)} />
        <button type="submit">Add Type</button>
      </form>
      <div className="chips" style={{ marginTop: "1rem" }}>
        {categories.map((c) => (
          <span className="chip" key={c.id}>
            {c.name}
            <button title="Rename" onClick={() => { const n = prompt("Rename vehicle type", c.name); if (n) run(api.updateCategory(c.id, n)); }}>✎</button>
            <button title="Delete" onClick={() => run(api.deleteCategory(c.id))}>✕</button>
          </span>
        ))}
      </div>

      <h3 style={{ marginTop: "2.5rem" }}>{editingId ? `Edit Vehicle #${editingId}` : "Add New Vehicle"}</h3>
      <form className="form" onSubmit={submitProduct}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
          <input required placeholder="Vehicle Name (e.g. Hyundai Creta)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {form.name && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span>Preview:</span>
              <img 
                src={getVehicleImageUrl({ name: form.name })} 
                alt="Preview" 
                className="product-thumb" 
                style={{ width: "36px", height: "36px" }}
              />
            </div>
          )}
        </div>
        <input placeholder="Short Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: "1rem" }}>
          <input placeholder="Emoji (e.g. 🚙)" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
          <input required type="number" min="0.01" step="0.01" placeholder="Rate per day ($)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input required type="number" min="0" placeholder="Units available" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">No vehicle type</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="actions">
          <button type="submit">{editingId ? "Save Changes" : "Create Vehicle"}</button>
          {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      <h3 style={{ marginTop: "2.5rem" }}>Fleet & Availability ({products.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Rate / day</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="product-cell">
                  <img 
                    src={getVehicleImageUrl(p)} 
                    alt={p.name} 
                    className="product-thumb"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_VEHICLE_IMAGE;
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <small style={{ color: "var(--text-muted)" }}>{p.emoji}</small>
                  </div>
                </div>
              </td>
              <td>{p.category?.name || "—"}</td>
              <td><strong>${Number(p.price).toFixed(2)}</strong> /day</td>
              <td>
                <span className={`stock-tag ${p.stock === 0 ? "out" : p.stock < 5 ? "low" : ""}`}>
                  {p.stock} units
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem" }} onClick={() => edit(p)}>Edit</button>
                  <button className="danger" style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem" }} onClick={() => run(api.deleteProduct(p.id))}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
