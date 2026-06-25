import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Users, Plus, AlertCircle, Trash2, Download, Phone, MapPin, Instagram } from 'lucide-react';

const API = 'https://fashionhubdemo-production.up.railway.app';

// ⏳ Skeleton Loader
const SkeletonRow = () => (
  <tr className="border-b animate-pulse">
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-14"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
  </tr>
);

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete karna chahte ho?')) {
      try {
        await axios.delete(`${API}/api/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.log(err);
        alert('Error deleting customer.');
      }
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Instagram ID', 'Phone', 'Address', 'Orders'];
    const rows = customers.map(c => [
      c.name || 'N/A',
      c.instagramId || 'N/A',
      c.phone || 'N/A',
      c.address || 'N/A',
      c.orderHistory?.length || 0
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
  };

  const exportOrdersCSV = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`);
      const orders = res.data;
      const headers = ['Order ID', 'Total Amount', 'Status', 'Payment Status', 'Date'];
      const rows = orders.map(o => [
        o.orderId || 'N/A',
        o.totalAmount || 0,
        o.status || 'N/A',
        o.paymentStatus || 'N/A',
        new Date(o.createdAt).toLocaleDateString()
      ]);
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
    } catch (err) {
      console.log(err);
      alert('Error exporting orders.');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer base</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 text-sm flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Customers</span>
          </button>
          <button
            onClick={exportOrdersCSV}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Orders</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* ❌ Error State */}
        {error && !loading && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={fetchCustomers}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
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
              <span className="text-sm">Loading customers...</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 text-sm font-medium">Name</th>
                  <th className="pb-3 text-sm font-medium">Instagram ID</th>
                  <th className="pb-3 text-sm font-medium">Phone</th>
                  <th className="pb-3 text-sm font-medium">Address</th>
                  <th className="pb-3 text-sm font-medium">Orders</th>
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
        {!loading && !error && customers.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Customers Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Customers will appear here when they place their first order</p>
            <button 
              onClick={() => window.location.href = '/orders'}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-500/30"
            >
              <Plus size={18} />
              Create First Order
            </button>
          </div>
        )}

        {/* ✅ Data Table */}
        {!loading && !error && customers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left border-b bg-gray-50">
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Instagram</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Address</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Orders</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-purple-50/50 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                          {customer.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-gray-800">{customer.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-purple-600">
                        <Instagram size={14} />
                        <span className="text-sm">@{customer.instagramId || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Phone size={14} />
                        <span className="text-sm">{customer.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin size={14} />
                        <span className="text-sm">{customer.address || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium">
                        {customer.orderHistory?.length || 0} Orders
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default Customers;