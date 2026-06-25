import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ShoppingBag, Plus, AlertCircle, RefreshCw } from 'lucide-react';

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
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-14"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
  </tr>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.log(err);
      alert('Error updating order status.');
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'confirmed': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all orders</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
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
              onClick={fetchOrders}
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
              <span className="text-sm">Loading orders...</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 text-sm font-medium">Order ID</th>
                  <th className="pb-3 text-sm font-medium">Amount</th>
                  <th className="pb-3 text-sm font-medium">Status</th>
                  <th className="pb-3 text-sm font-medium">Payment</th>
                  <th className="pb-3 text-sm font-medium">Date</th>
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
        {!loading && !error && orders.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={40} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Orders will appear here when customers make purchases</p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-500/30"
            >
              <Plus size={18} />
              Add Products First
            </button>
          </div>
        )}

        {/* ✅ Data Table */}
        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left border-b bg-gray-50">
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Payment</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-purple-50/50 transition-colors">
                    <td className="py-3 px-4 text-purple-600 font-semibold text-sm">#{order.orderId}</td>
                    {/* ✅ Better Currency Format */}
                    <td className="py-3 px-4 font-semibold text-gray-800">{formatPKR(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-red-100 text-red-600 border-red-200'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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

export default Orders;