import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const ordersRes = await axios.get('http://localhost:5000/api/orders');
      const customersRes = await axios.get('http://localhost:5000/api/customers');
      const orders = ordersRes.data;
      const customers = customersRes.data;

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;

      setStats({
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalRevenue,
        pendingOrders
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.log('Error fetching stats:', err);
    }
  };

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-blue-500' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: 'bg-green-500' },
    { label: 'Total Revenue', value: `Rs ${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-purple-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className={`${card.color} text-white text-2xl w-12 h-12 rounded-lg flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-blue-600">#{order.orderId}</td>
                  <td className="py-3">Rs {order.totalAmount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default Dashboard;