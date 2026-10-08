import { useEffect, useState } from "react";
import { api } from "../api.js";

const FLOW = ["placed", "packed", "out_for_delivery", "delivered"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const load = () => api.orders().then(setOrders).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  async function act(promise) {
    try {
      await promise;
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <>
      <h2>Your orders</h2>
      {error && <p className="error">{error}</p>}
      {orders.map((o) => {
        const next = FLOW[FLOW.indexOf(o.status) + 1];
        return (
          <div className="card wide" key={o.id}>
            <div className="row">
              <strong>Order #{o.id}</strong>
              <span className={`badge ${o.status}`}>{o.status.replaceAll("_", " ")}</span>
            </div>
            <small>{o.customer_name}, {o.address}</small>
            <ul>
              {o.items.map((i) => (
                <li key={i.id}>{i.quantity} x {i.name} (${Number(i.price).toFixed(2)})</li>
              ))}
            </ul>
            <div className="row">
              <strong>${Number(o.total).toFixed(2)}</strong>
              <span>{o.status === "delivered" ? "Delivered" : o.status === "cancelled" ? "Cancelled" : `ETA ${o.eta_minutes} min`}</span>
            </div>
            <div className="actions">
              {next && o.status !== "cancelled" && (
                <button onClick={() => act(api.setOrderStatus(o.id, next))}>Advance to {next.replaceAll("_", " ")}</button>
              )}
              {o.status === "placed" && (
                <button className="danger" onClick={() => act(api.setOrderStatus(o.id, "cancelled"))}>Cancel</button>
              )}
              <button className="danger" onClick={() => act(api.deleteOrder(o.id))}>Delete</button>
            </div>
          </div>
        );
      })}
    </>
  );
}
