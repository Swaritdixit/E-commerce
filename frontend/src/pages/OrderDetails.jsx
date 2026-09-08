import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { errorMessage, money, statusLabel } from "../utils/helpers";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const cancel = async () => {
    try {
      await api.put(`/orders/${id}/cancel`);
      setMessage("Order cancelled.");
      load();
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  if (loading) return <Loader />;
  if (!order) return <div className="container section"><div className="alert error">{message}</div></div>;

  return (
    <div className="container section">
      <Link to="/orders" className="back-link">← My orders</Link>
      <div className="section-heading">
        <div>
          <span className="eyebrow">ORDER</span>
          <h1>#{order._id.slice(-10).toUpperCase()}</h1>
        </div>
        <span className={`badge ${order.orderStatus}`}>{statusLabel(order.orderStatus)}</span>
      </div>

      {message && <div className="alert">{message}</div>}

      <div className="detail-grid order-detail-grid">
        <div className="panel">
          <h2>Items</h2>
          {order.items?.map((item) => (
            <div className="order-item" key={item._id}>
              <div>
                <strong>{item.product?.name || "Product"}</strong>
                <p className="muted">Qty: {item.quantity}</p>
              </div>
              <strong>{money(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>

        <aside className="summary-card">
          <h2>Payment</h2>
          <div className="summary-line"><span>Payment status</span><strong>{statusLabel(order.paymentStatus)}</strong></div>
          <div className="summary-line"><span>Method</span><strong>{order.paymentMethod || "Razorpay"}</strong></div>
          <hr />
          <div className="summary-line total-line"><span>Total</span><strong>{money(order.totalAmount)}</strong></div>
          {order.orderStatus === "pending" && (
            <button className="btn danger-btn full" onClick={cancel}>Cancel order</button>
          )}
        </aside>
      </div>
    </div>
  );
}