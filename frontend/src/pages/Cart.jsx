import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

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

  if (cart.items.length === 0) return <p>Your cart is empty. Go add some snacks!</p>;

  return (
    <>
      <h2>Your cart</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <tbody>
          {cart.items.map((i) => (
            <tr key={i.id}>
              <td>{i.product.emoji} {i.product.name}</td>
              <td>${Number(i.product.price).toFixed(2)}</td>
              <td>
                <button onClick={() => i.quantity > 1 ? change(api.setCartQty(i.id, i.quantity - 1)) : change(api.removeCartItem(i.id))}>−</button>
                <span className="qty">{i.quantity}</span>
                <button onClick={() => change(api.setCartQty(i.id, i.quantity + 1))}>+</button>
              </td>
              <td>${(i.product.price * i.quantity).toFixed(2)}</td>
              <td><button className="danger" onClick={() => change(api.removeCartItem(i.id))}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: ${cart.total.toFixed(2)}</h3>
      <form className="form" onSubmit={checkout}>
        <input required placeholder="Your name" value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
        <input required placeholder="Delivery address" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button type="submit">Pay (fake) and place order</button>
      </form>
    </>
  );
}
