import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { money, errorMessage } from "../../utils/helpers";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/orders/admin/all"),
      api.get("/products", { params: { page: 1, limit: 100 } }),
    ])
      .then(([ordersRes, productsRes]) => {
        setOrders(ordersRes.data.orders || []);
        setProducts(productsRes.data.product || []);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        <div className="stat-card"><span>Orders</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><span>Products</span><strong>{products.length}</strong></div>
        <div className="stat-card"><span>Revenue</span><strong>{money(revenue)}</strong></div>
        <div className="stat-card"><span>Pending</span><strong>{orders.filter(o => o.orderStatus === "pending").length}</strong></div>
      </div>
    </div>
  );
}