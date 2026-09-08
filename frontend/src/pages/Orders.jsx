import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { money, statusLabel, errorMessage } from "../utils/helpers";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders")
      .then(({ data }) => setOrders(data.orders || []))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container section">
      <h1>My orders</h1>
      {error && <div className="alert error">{error}</div>}
      {!orders.length && !error && <div className="empty-state">You have no orders yet.</div>}

      <div className="order-list">
        {orders.map((order) => (
          <Link to={`/orders/${order._id}`} className="order-card" key={order._id}>
            <div>
              <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
              <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="order-card-right">
              <span className={`badge ${order.orderStatus}`}>{statusLabel(order.orderStatus)}</span>
              <strong>{money(order.totalAmount)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}