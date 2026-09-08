import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils/helpers";

export default function Profile() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/addresses")
      .then(({ data }) => setAddresses(Array.isArray(data) ? data : data.addresses || []))
      .catch((err) => setMessage(errorMessage(err)));
  }, []);

  const deleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((address) => address._id !== id));
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  return (
    <div className="container section">
      <h1>Profile</h1>
      {message && <div className="alert error">{message}</div>}

      <section className="panel profile-card">
        <h2>Account</h2>
        <p><strong>Name:</strong> {user?.name || "—"}</p>
        <p><strong>Email:</strong> {user?.email || "—"}</p>
        <p><strong>Role:</strong> {user?.role || "Customer"}</p>
      </section>

      <section className="panel">
        <h2>Saved addresses</h2>
        {!addresses.length && <p className="muted">No addresses saved.</p>}
        <div className="address-list">
          {addresses.map((address) => (
            <div className="address-card" key={address._id}>
              <div>
                <strong>{address.name}</strong>
                <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                <p>{address.city}, {address.state}, {address.country} — {address.postalCode}</p>
                <p>{address.phone}</p>
              </div>
              <button className="text-button danger" onClick={() => deleteAddress(address._id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}