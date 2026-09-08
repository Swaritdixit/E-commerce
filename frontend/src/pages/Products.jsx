import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import Loader from "../components/Loader";
import api from "../services/api";
import { errorMessage } from "../utils/helpers";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        search: filters.search || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort || undefined,
        page: 1,
        limit: 50,
      };
      const { data } = await api.get("/products", { params });
      setProducts(data.product || []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">STORE</span>
          <h1>All products</h1>
        </div>
      </div>

      <form className="filter-bar" onSubmit={submit}>
        <input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          type="number"
          min="0"
          placeholder="Min ₹"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          min="0"
          placeholder="Max ₹"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
        </select>
        <button className="btn">Apply</button>
      </form>

      {loading && <Loader />}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && <ProductGrid products={products} />}
    </div>
  );
}