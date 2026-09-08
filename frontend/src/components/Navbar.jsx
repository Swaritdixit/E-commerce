import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">ShopSphere</Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          {user && (
            <NavLink to="/cart">
              Cart <span className="cart-count">{itemCount}</span>
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              {(user.role === "Admin" ||
                user.role === "SuperAdmin" ||
                user.role === "Super Admin") && (
                <Link className="btn btn-small btn-outline" to="/admin">
                  Admin
                </Link>
              )}
              <Link className="user-name" to="/profile">
                {user.name || user.email}
              </Link>
              <button className="btn btn-small" onClick={signOut}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-small btn-outline" to="/login">
                Login
              </Link>
              <Link className="btn btn-small" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}