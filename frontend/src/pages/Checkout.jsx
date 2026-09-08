import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { money, errorMessage } from "../utils/helpers";

export default function Checkout() {
  const { items, total, loadCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", country: "India", postalCode: "", isDefault: false
  });
  const [message, setMessage] = useState("");
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(Array.isArray(data) ? data : data.addresses || []);
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    setCreatingAddress(true);
    try {
      const { data } = await api.post("/addresses", newAddress);
      const added = data.address || data;
      setAddresses((prev) => [...prev, added]);
      setSelectedAddress(added._id);
      setNewAddress({
        name: "", phone: "", addressLine1: "", addressLine2: "",
        city: "", state: "", country: "India", postalCode: "", isDefault: false
      });
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setCreatingAddress(false);
    }
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      setMessage("Select or add a shipping address.");
      return;
    }

    setCreatingOrder(true);
    try {
      const { data } = await api.post("/orders", { addressId: selectedAddress });
      const order = data.order;
      await loadCart();

      // Load Razorpay checkout only when payment is actually requested.
      const payment = await api.post("/payments/create-payment", {
        orderId: order._id,
      });

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => openRazorpay(order, payment.data);
        document.body.appendChild(script);
      } else {
        openRazorpay(order, payment.data);
      }
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setCreatingOrder(false);
    }
  };

  const openRazorpay = (order, paymentData) => {
    const options = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: paymentData.currency || "INR",
      name: "ShopSphere",
      description: `Order ${order._id}`,
      order_id: paymentData.razorpayOrderId,
      handler: async (response) => {
        try {
          await api.post("/payments/verify-payment", response);
          navigate(`/orders/${order._id}`);
        } catch (err) {
          setMessage(errorMessage(err));
        }
      },
      prefill: {},
      theme: { color: "#111827" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (response) => {
      setMessage(response.error?.description || "Payment failed.");
    });
    razorpay.open();
  };

  if (!items.length) {
    return <div className="container section center-page"><h1>Cart is empty</h1></div>;
  }

  return (
    <div className="container section">
      <div className="section-heading">
        <h1>Checkout</h1>
      </div>

      {message && <div className="alert error">{message}</div>}

      <div className="checkout-grid">
        <div>
          <section className="panel">
            <h2>Choose shipping address</h2>
            {!addresses.length && <p className="muted">No saved addresses.</p>}
            <div className="address-list">
              {addresses.map((address) => (
                <label className={`address-card ${selectedAddress === address._id ? "selected" : ""}`} key={address._id}>
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    checked={selectedAddress === address._id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  />
                  <div>
                    <strong>{address.name}</strong>
                    <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                    <p>{address.city}, {address.state} — {address.postalCode}</p>
                    <p>{address.country} · {address.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <form className="panel" onSubmit={addAddress}>
            <h2>Add new address</h2>
            <div className="form-grid">
              <input required placeholder="Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
              <input required placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
              <input required placeholder="Address line 1" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
              <input placeholder="Address line 2" value={newAddress.addressLine2} onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
              <input required placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
              <input required placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
              <input required placeholder="Postal code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
              <input required placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
            </div>
            <button className="btn" disabled={creatingAddress}>{creatingAddress ? "Saving..." : "Save address"}</button>
          </form>
        </div>

        <aside className="summary-card">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div className="summary-line" key={item.product._id}>
              <span>{item.product.name} × {item.quantity}</span>
              <strong>{money(item.product.price * item.quantity)}</strong>
            </div>
          ))}
          <hr />
          <div className="summary-line total-line"><span>Total</span><strong>{money(total)}</strong></div>
          <button className="btn full" onClick={createOrder} disabled={creatingOrder}>
            {creatingOrder ? "Creating order..." : "Pay with Razorpay"}
          </button>
        </aside>
      </div>
    </div>
  );
}