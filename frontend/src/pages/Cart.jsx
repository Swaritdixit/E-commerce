import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { imageUrl, money } from "../utils/helpers";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="container section center-page">
        <h1>Your cart is empty</h1>
        <p className="muted">Add something you like and come back here.</p>
        <Link className="btn" to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-heading">
        <h1>Your cart</h1>
        <button className="btn btn-outline" onClick={clearCart} disabled={loading}>Clear cart</button>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => {
            const product = item.product;
            return (
              <div className="cart-item" key={product?._id || item._id}>
                <img src={imageUrl(product)} alt={product?.name} />
                <div className="cart-item-info">
                  <Link to={`/products/${product?._id}`}><h3>{product?.name}</h3></Link>
                  <p>{money(product?.price)}</p>
                  <div className="quantity-row">
                    <button disabled={loading || item.quantity <= 1} onClick={() => updateQuantity(product._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button disabled={loading || item.quantity >= product.stock} onClick={() => updateQuantity(product._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <strong>{money(product?.price * item.quantity)}</strong>
                  <button className="text-button danger" onClick={() => removeFromCart(product._id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="summary-card">
          <h2>Summary</h2>
          <div className="summary-line"><span>Subtotal</span><strong>{money(total)}</strong></div>
          <div className="summary-line"><span>Shipping</span><strong>Free</strong></div>
          <hr />
          <div className="summary-line total-line"><span>Total</span><strong>{money(total)}</strong></div>
          <button className="btn full" onClick={() => navigate("/checkout")}>Checkout</button>
        </aside>
      </div>
    </div>
  );
}