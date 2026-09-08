import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils/helpers";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Create account</h1>
        <p className="muted">Start shopping in a few seconds.</p>

        {error && <div className="alert error">{error}</div>}

        <label>Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label>Email</label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label>Password</label>
        <input minLength="8" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <p className="muted small">
          New registrations are treated as Customer accounts by the backend.
        </p>

        <button className="btn full" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="center muted">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}