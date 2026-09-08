import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils/helpers";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(form.email, form.password);
      const role = data.role || data.user?.role;
      if (role === "Admin" || role === "SuperAdmin" || role === "Super Admin") {
        navigate(location.state?.from || "/admin");
      } else {
        navigate(location.state?.from || "/products");
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Welcome back</h1>
        <p className="muted">Login to continue shopping.</p>

        {error && <div className="alert error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
        />

        <button className="btn full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="center muted">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}