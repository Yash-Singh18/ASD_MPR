import { useCallback, useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { api } from "./api.js";
import Shop from "./pages/Shop.jsx";
import Admin from "./pages/Admin.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    try {
      const cart = await api.cart();
      setCartCount(cart.items.reduce((n, i) => n + i.quantity, 0));
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <>
      <header className="nav">
        <span className="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', color: 'var(--brand)' }}>
            <path d="M4 7H20L18 21H6L4 7Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 10L10 14H14L11 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          QuickDrop
        </span>
        <nav>
          <NavLink to="/" end>Shop</NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Shop onCartChange={refreshCart} />} />
          <Route path="/cart" element={<Cart onCartChange={refreshCart} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  );
}
