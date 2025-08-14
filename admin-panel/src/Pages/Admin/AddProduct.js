import React, { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import '../../styles/AdminLayout.css';
import '../../styles/AddProduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !quantity || !image) {
      setMessage('❌ Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Product added successfully!');
        setName('');
        setPrice('');
        setCategory('');
        setQuantity('');
        setImage(null);
        setPreview(null);
      } else {
        setMessage('❌ Failed to add product.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ An error occurred.');
    }
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className="admin-page">
        <h1>Add New Product</h1>

        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', marginTop: '20px' }}>
          <div>
            <label>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          <div>
            <label>Price (LKR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            >
              <option value="">Select Category</option>
              <option value="Flowering Plants">Flowering Plants</option>
              <option value="Veggies & Seeds">Veggies & Seeds</option>
              <option value="Indoor & Green Plants">Indoor & Green Plants</option>
            </select>
          </div>

          <div>
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          <div>
            <label>Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ margin: '5px 0' }}
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }}
            />
          )}

          <button type="submit" style={{ marginTop: '15px', padding: '10px 20px' }}>
            Add Product
          </button>

          {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
        </form>
      </div>
    </>
  );
};

export default AddProduct;
