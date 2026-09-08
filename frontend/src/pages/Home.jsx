import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container hero-content">
          <div>
            <span className="eyebrow">WELCOME TO SHOPSPHERE</span>
            <h1>Find products you’ll actually love.</h1>
            <p>
              Browse products, manage your cart, checkout securely and track
              every order from one place.
            </p>
            <div className="hero-actions">
              <Link className="btn" to="/products">Shop now</Link>
              <Link className="btn btn-outline" to="/register">Create account</Link>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-icon">🛍️</div>
            <h3>Simple shopping</h3>
            <p>Search → Add to cart → Checkout → Track.</p>
          </div>
        </div>
      </section>

      <section className="container feature-grid">
        <div className="feature"><span>🚚</span><h3>Fast delivery</h3><p>Track your orders from your account.</p></div>
        <div className="feature"><span>🔒</span><h3>Secure payments</h3><p>Razorpay payment integration is ready on the frontend.</p></div>
        <div className="feature"><span>⭐</span><h3>Verified reviews</h3><p>Customers can review purchased products.</p></div>
      </section>
    </div>
  );
}