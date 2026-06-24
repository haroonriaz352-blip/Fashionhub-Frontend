import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', price: '', description: '',
    sizes: '', colors: '', stock: '', discount: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        discount: Number(form.discount),
        sizes: form.sizes.split(',').map(s => s.trim()),
        colors: form.colors.split(',').map(c => c.trim()),
      };
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/products', data);
      }
      setShowForm(false);
      setEditingProduct(null);
      setForm({ name: '', category: '', price: '', description: '', sizes: '', colors: '', stock: '', discount: '' });
      fetchProducts();
    } catch (err) { console.log(err); }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      stock: product.stock,
      discount: product.discount || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete karna chahte ho?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
      } catch (err) { console.log(err); }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingProduct(null); setForm({ name: '', category: '', price: '', description: '', sizes: '', colors: '', stock: '', discount: '' }); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Product Name' },
              { key: 'category', label: 'Category' },
              { key: 'price', label: 'Price (Rs)' },
              { key: 'stock', label: 'Stock' },
              { key: 'sizes', label: 'Sizes (comma separated)' },
              { key: 'colors', label: 'Colors (comma separated)' },
              { key: 'discount', label: 'Discount (%)' },
            ].map(field => (
              <input
                key={field.key}
                placeholder={field.label}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            ))}
            <input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="border rounded-lg px-3 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              {editingProduct ? 'Update Product' : 'Save Product'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        {products.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No products yet!</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{product.name}</td>
                  <td className="py-3 text-gray-500">{product.category}</td>
                  <td className="py-3 text-green-600 font-medium">Rs {product.price}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 text-orange-600">{product.discount}%</td>
                  <td className="py-3 flex gap-3">
                    <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 text-sm">✏️ Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 text-sm">🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;