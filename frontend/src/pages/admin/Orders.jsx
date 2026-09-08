import { useEffect, useState } from "react";
import api from "../../services/api";
import { errorMessage, money, statusLabel } from "../../utils/helpers";

const nextStatus = {
  pending: "processing",
  processing: "shipped",
  shipped: "delivered",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/orders/admin/all");
      setOrders(data.orders || []);
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    try {
      await api.put(`/orders/admin/${id}/status`, { status });
      load();
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {message && <div className="alert error">{message}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const next = nextStatus[order.orderStatus];
              return (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.user?.name || order.user?.email || "—"}</td>
                  <td>{money(order.totalAmount)}</td>
                  <td><span className={`badge ${order.orderStatus}`}>{statusLabel(order.orderStatus)}</span></td>
                  <td>
                    {next ? (
                      <button className="text-button" onClick={() => update(order._id, next)}>
                        Mark {statusLabel(next)}
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}