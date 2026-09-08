import { useEffect, useState } from "react";
import api from "../../services/api";
import { errorMessage } from "../../utils/helpers";

const empty = { name: "", description: "", image: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.categories || data || []);
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/categories/${editing._id}`, form);
      else await api.post("/categories", form);
      setForm(empty);
      setEditing(null);
      load();
      setMessage("Category saved.");
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  return (
    <div>
      <h1>Categories</h1>
      {message && <div className="alert">{message}</div>}

      <form className="panel" onSubmit={submit}>
        <h2>{editing ? "Edit category" : "Add category"}</h2>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input required placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <button className="btn">{editing ? "Update" : "Create"}</button>
        {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button className="text-button" onClick={() => { setEditing(category); setForm({ name: category.name, description: category.description, image: category.image || "" }); }}>Edit</button>
                  <button className="text-button danger" onClick={() => remove(category._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}