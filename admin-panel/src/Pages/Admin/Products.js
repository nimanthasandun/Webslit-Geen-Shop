// admin-panel/src/pages/admin/Products.js
import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import '../../styles/AdminLayout.css';
import '../../styles/Product.css';

const API_URL = 'http://localhost:5000/api/products';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [editing, setEditing]   = useState(null);        // product being edited (or null)
  const [form, setForm]         = useState({             // edit-form values
    name: '', price: '', category: '', quantity: '',
    image: null, preview: null,
  });

  /* ───────────────────────────────── fetch list ────────────────────────────── */
  const loadProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  /* ───────────────────────────────── delete ───────────────────────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setProducts(products.filter((p) => p.id !== id));
      else alert('Delete failed.');
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  /* ───────────────────────────────── edit ─────────────────────────────────── */
  const openEdit = (product) => {
    setEditing(product.id);
    setForm({
      name:      product.name,
      price:     product.price,
      category:  product.category,
      quantity:  product.quantity,
      image:     null,
      preview:   `http://localhost:5000/uploads/${product.image}`,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm((f) => ({ ...f, image: file, preview: URL.createObjectURL(file) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name',     form.name);
    fd.append('price',    form.price);
    fd.append('category', form.category);
    fd.append('quantity', form.quantity);
    if (form.image) fd.append('image', form.image);

    try {
      const res   = await fetch(`${API_URL}/${editing}`, { method: 'PUT', body: fd });
      const data  = await res.json();
      if (data.success) {
        await loadProducts();         // refresh list
        setEditing(null);             // close modal
      } else {
        alert('Update failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  /* ──────────────────────────────── render ────────────────────────────────── */
  return (
    <>
      <AdminNavbar />
      <AdminSidebar />

      <div className="admin-page">
        <h1>Manage Products</h1>

        {loading && <p>Loading…</p>}
        {error   && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && products.length === 0 && <p>No products found.</p>}

        {products.length > 0 && (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Price (LKR)</th>
                <th>Category</th><th>Qty</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={`http://localhost:5000/uploads/${p.image}`}
                      alt={p.name}
                      style={{ width: 60, borderRadius: 6 }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{Number(p.price).toLocaleString()}</td>
                  <td>{p.category}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <button onClick={() => openEdit(p)}>Edit</button>{' '}
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ─────────────────────── edit modal ─────────────────────── */}
        {editing && (
          <div className="edit-modal">
            <div className="modal-content">
              <h2>Edit Product</h2>
              <form onSubmit={submitEdit}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <label>Price (LKR)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />

                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Flowering Plants">Flowering Plants</option>
                  <option value="Veggies & Seeds">Veggies & Seeds</option>
                  <option value="Indoor & Green Plants">Indoor & Green Plants</option>
                </select>

                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />

                <label>Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />
                {form.preview && (
                  <img
                    src={form.preview}
                    alt="preview"
                    style={{ width: 80, marginTop: 8, borderRadius: 6 }}
                  />
                )}

                <div style={{ marginTop: 16 }}>
                  <button type="submit">Save</button>{' '}
                  <button type="button" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
