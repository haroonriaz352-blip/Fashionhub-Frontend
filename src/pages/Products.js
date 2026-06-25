import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Package, Plus, AlertCircle, Trash2, Pencil } from 'lucide-react';

const API = 'https://fashionhubdemo-production.up.railway.app';

// ✅ Currency Formatter
const formatPKR = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ⏳ Skeleton Loader
const SkeletonRow = () => (
  <tr className="border-b animate-pulse">
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-10"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
  </tr>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', price: '', description: '',
    sizes: '', colors: '', stock: '', discount: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
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
        await axios.put(`${API}/api/products/${editingProduct._id}`, data);
      } else {
        await axios.post(`${API}/api/products`, data);
      }
      setShowForm(false);
      setEditingProduct(null);
      setForm({ name: '', category: '', price: '', description: '', sizes: '', colors: '', stock: '', discount: '' });
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert('Error saving product. Please try again.');
    }
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
        await axios.delete(`${API}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.log(err);
        alert('Error deleting product.');
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingProduct(null); setForm({ name: '', category: '', price: '', description: '', sizes: '', colors: '', stock: '', discount: '' }); }}
          className="bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Product Name', type: 'text' },
              { key: 'category', label: 'Category', type: 'text' },
              { key: 'price', label: 'Price (PKR)', type: 'number' },
              { key: 'stock', label: 'Stock Quantity', type: 'number' },
              { key: 'sizes', label: 'Sizes (comma separated)', type: 'text' },
              { key: 'colors', label: 'Colors (comma separated)', type: 'text' },
              { key: 'discount', label: 'Discount (%)', type: 'number' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.label}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <textarea
                placeholder="Product description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-colors">
              {editingProduct ? 'Update Product' : 'Save Product'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* ❌ Error State */}
        {error && !loading && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ⏳ Loading State */}
        {loading && !error && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading products...</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 text-sm font-medium">Name</th>
                  <th className="pb-3 text-sm font-medium">Category</th>
                  <th className="pb-3 text-sm font-medium">Price</th>
                  <th className="pb-3 text-sm font-medium">Stock</th>
                  <th className="pb-3 text-sm font-medium">Discount</th>
                  <th className="pb-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        )}

        {/* 📭 Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start building your catalog by adding your first product</p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-500/30"
            >
              <Plus size={18} />
              Add Your First Product
            </button>
          </div>
        )}

        {/* ✅ Data Table */}
        {!loading && !error && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left border-b bg-gray-50">
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Discount</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-purple-50/50 transition-colors group">
                    <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{product.category}</td>
                    {/* ✅ Better Currency Format */}
                    <td className="py-3 px-4 text-purple-600 font-semibold">{formatPKR(product.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-600' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-red-100 text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {product.discount > 0 ? (
                        <span className="text-orange-600 font-medium text-sm">{product.discount}% OFF</span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;