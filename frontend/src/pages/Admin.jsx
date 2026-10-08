import { useEffect, useState } from "react";
import { api } from "../api.js";

const EMPTY = { name: "", description: "", emoji: "🛒", price: "", stock: 0, category_id: "" };

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
      <h2>Admin</h2>
      {error && <p className="error">{error}</p>}

      <h3>Categories</h3>
      <form className="form inline" onSubmit={(e) => { e.preventDefault(); run(api.createCategory(catName)); setCatName(""); }}>
        <input required placeholder="New category" value={catName} onChange={(e) => setCatName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <div className="chips">
        {categories.map((c) => (
          <span className="chip" key={c.id}>
            {c.name}
            <button title="Rename" onClick={() => { const n = prompt("Rename category", c.name); if (n) run(api.updateCategory(c.id, n)); }}>✎</button>
            <button title="Delete" onClick={() => run(api.deleteCategory(c.id))}>✕</button>
          </span>
        ))}
      </div>

      <h3>{editingId ? `Edit product #${editingId}` : "New product"}</h3>
      <form className="form" onSubmit={submitProduct}>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Emoji" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
        <input required type="number" min="0.01" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input required type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="actions">
          <button type="submit">{editingId ? "Save" : "Create"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      <h3>Products</h3>
      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.emoji} {p.name}</td>
              <td>{p.category?.name || "-"}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => edit(p)}>Edit</button>{" "}
                <button className="danger" onClick={() => run(api.deleteProduct(p.id))}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
