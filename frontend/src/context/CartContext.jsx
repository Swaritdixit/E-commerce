import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart || { items: [] });
    } catch {
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await api.post("/cart/add", { productId, quantity });
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      await api.put(`/cart/${productId}`, { quantity });
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      await api.delete(`/cart/${productId}`);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await api.delete("/cart/clear");
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const items = cart.items || [];
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const total = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.product?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        total,
        loading,
        loadCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);