import { useEffect, useState } from "react";
import { api } from "../api.js";
import { getVehicleImageUrl, DEFAULT_VEHICLE_IMAGE } from "../vehicleImages.js";

const FLOW = ["placed", "packed", "out_for_delivery", "delivered"];
const LABEL = {
  placed: "booked",
  packed: "confirmed",
  out_for_delivery: "on rent",
  delivered: "returned",
  cancelled: "cancelled",
};

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

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
        <h2>No bookings yet</h2>
        <p style={{ color: "var(--text-muted)" }}>When you book a vehicle, its live status will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <h2>Your Bookings & Live Status</h2>
      {error && <p className="error">{error}</p>}
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {orders.map((o) => {
          const next = FLOW[FLOW.indexOf(o.status) + 1];
          return (
            <div className="card" key={o.id} style={{ padding: "1.5rem" }}>
              <div className="row" style={{ marginTop: 0, paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <h3 style={{ margin: 0, display: "inline-block", marginRight: "0.75rem" }}>Booking #{o.id}</h3>
                  <small style={{ color: "var(--text-muted)" }}>{new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
                <span className={`badge ${o.status}`}>{LABEL[o.status]}</span>
              </div>

              <div style={{ margin: "1rem 0" }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Pickup for:</div>
                <div style={{ color: "var(--text-muted)" }}>{o.customer_name} &bull; {o.address}</div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", margin: "1rem 0" }}>
                {o.items.map((i) => (
                  <div key={i.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg)", padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <img 
                      src={getVehicleImageUrl({ name: i.name })} 
                      alt={i.name} 
                      className="product-thumb" 
                      style={{ width: "36px", height: "36px" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_VEHICLE_IMAGE;
                      }}
                    />
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{i.quantity} &times; {i.name}</div>
                      <small style={{ color: "var(--text-muted)" }}>${Number(i.price).toFixed(2)} / day each</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row">
                <div className="price">${Number(o.total).toFixed(2)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, color: o.status === "delivered" ? "var(--success)" : "var(--brand)" }}>
                  {o.status === "delivered" ? "✓ Returned" : o.status === "cancelled" ? "Cancelled" : `⏱ Ready for pickup in ${o.eta_minutes} mins`}
                </div>
              </div>

              <div className="actions" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem" }}>
                {next && o.status !== "cancelled" && (
                  <button onClick={() => act(api.setOrderStatus(o.id, next))}>
                    Mark as &ldquo;{LABEL[next]}&rdquo;
                  </button>
                )}
                {o.status === "placed" && (
                  <button className="secondary" onClick={() => act(api.setOrderStatus(o.id, "cancelled"))}>
                    Cancel Booking
                  </button>
                )}
                <button className="danger" onClick={() => act(api.deleteOrder(o.id))}>
                  Delete Booking
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
