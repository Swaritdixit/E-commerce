import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { errorMessage, money } from "../utils/helpers";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState({ reviews: [], averageRating: 0, totalReviews: 0 });
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [productRes, reviewRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`),
      ]);
      setProduct(productRes.data.product);
      setReviews(reviewRes.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const add = async () => {
    try {
      await addToCart(id, quantity);
      setMessage("Added to cart.");
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/reviews", {
        productId: id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: "" });
      setMessage("Review submitted.");
      const { data } = await api.get(`/reviews/product/${id}`);
      setReviews(data);
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container section"><div className="alert error">{error}</div></div>;
  if (!product) return null;

  return (
    <div className="container section">
      <Link to="/products" className="back-link">← Back to products</Link>

      <div className="detail-grid">
        <div className="detail-image">
          <img
            src={product.images?.[0]?.url || "https://placehold.co/900x900?text=No+Image"}
            alt={product.name}
          />
        </div>

        <div className="detail-info">
          <span className="eyebrow">{product.category?.name || "PRODUCT"}</span>
          <h1>{product.name}</h1>
          <div className="rating">
            ★ {Number(reviews.averageRating || 0).toFixed(1)}
            <span> ({reviews.totalReviews || 0} reviews)</span>
          </div>
          <h2>{money(product.price)}</h2>
          <p>{product.description}</p>

          <div className="quantity-row">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}>+</button>
          </div>

          <button className="btn" disabled={!product.stock || cartLoading} onClick={add}>
            {product.stock ? "Add to cart" : "Out of stock"}
          </button>
          {message && <div className="alert">{message}</div>}
        </div>
      </div>

      <section className="reviews-section">
        <div className="section-heading">
          <div><span className="eyebrow">CUSTOMER FEEDBACK</span><h2>Reviews</h2></div>
        </div>

        {reviews.reviews?.length ? (
          <div className="review-list">
            {reviews.reviews.map((review) => (
              <article className="review" key={review._id}>
                <div className="review-head">
                  <strong>{review.user?.name || "Customer"}</strong>
                  <span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">No reviews yet.</div>
        )}

        {user && (
          <form className="form-card review-form" onSubmit={submitReview}>
            <h3>Write a review</h3>
            <label>Rating</label>
            <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Average</option>
              <option value="2">2 — Poor</option>
              <option value="1">1 — Bad</option>
            </select>
            <label>Comment</label>
            <textarea required value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            <button className="btn">Submit review</button>
          </form>
        )}
      </section>
    </div>
  );
}