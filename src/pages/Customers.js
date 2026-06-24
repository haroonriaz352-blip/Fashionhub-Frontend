import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete karna chahte ho?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        fetchCustomers();
      } catch (err) { console.log(err); }
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
      const res = await axios.get('http://localhost:5000/api/orders');
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
    } catch (err) { console.log(err); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
          >
            📥 Export Customers CSV
          </button>
          <button
            onClick={exportOrdersCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            📥 Export Orders CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {customers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No customers yet</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Instagram ID</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Address</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{customer.name || 'N/A'}</td>
                  <td className="py-3 text-purple-600">@{customer.instagramId}</td>
                  <td className="py-3 text-gray-500">{customer.phone || 'N/A'}</td>
                  <td className="py-3 text-gray-500">{customer.address || 'N/A'}</td>
                  <td className="py-3">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                      {customer.orderHistory?.length || 0} Orders
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️ Delete
                    </button>
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

export default Customers;