import { Link } from "react-router-dom";
import { imageUrl, money } from "../utils/helpers";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();

  const handleAdd = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      await addToCart(product._id, 1);
      alert("Added to cart");
    } catch (error) {
      alert(error?.response?.data?.message || "Could not add to cart");
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-wrap">
        <img src={imageUrl(product)} alt={product.name} className="product-image" />
      </Link>

      <div className="product-card-body">
        <div className="muted small">
          {product.category?.name || "Product"}
        </div>
        <Link to={`/products/${product._id}`} className="product-title">
          {product.name}
        </Link>
        <p className="product-price">{money(product.price)}</p>
        <p className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
          {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
        </p>
        <button
          className="btn full"
          disabled={!product.stock || loading}
          onClick={handleAdd}
        >
          {loading ? "Adding..." : "Add to cart"}
        </button>
      </div>
    </article>
  );
}