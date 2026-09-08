import { useEffect, useState } from "react";
import api from "../../services/api";
import { errorMessage, money } from "../../utils/helpers";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products", { params: { page: 1, limit: 100 } }),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data.product || []);
      setCategories(categoriesRes.data.categories || categoriesRes.data || []);
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const body = new FormData();
      body.append("name", form.name);
      body.append("description", form.description);
      body.append("price", form.price);
      body.append("category", form.category);
      body.append("stock", form.stock);
      Array.from(files).forEach((file) => body.append("images", file));

      if (editing) {
        await api.put(`/products/${editing._id}`, body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm(emptyForm);
      setEditing(null);
      setFiles([]);
      await load();
      setMessage("Product saved.");
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  const edit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category || "",
      stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  return (
    <div>
      <h1>Products</h1>
      {message && <div className="alert">{message}</div>}

      <form className="panel" onSubmit={submit}>
        <h2>{editing ? "Edit product" : "Add product"}</h2>
        <div className="form-grid">
          <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input required type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((category) => <option value={category._id} key={category._id}>{category.name}</option>)}
          </select>
          <textarea className="wide" required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="wide" type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
        </div>
        <button className="btn">{editing ? "Update product" : "Create product"}</button>
        {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm(emptyForm); }}>Cancel</button>}
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category?.name || "—"}</td>
                <td>{money(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="text-button" onClick={() => edit(product)}>Edit</button>
                  <button className="text-button danger" onClick={() => remove(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}