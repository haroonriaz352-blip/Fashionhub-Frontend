import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Package, Users, DollarSign, Clock, Calendar, RefreshCw, TrendingUp } from 'lucide-react';

const API = 'https://fashionhubdemo-production.up.railway.app';

// ✅ BETTER CURRENCY FORMATTER
const formatPKR = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// 🎬 Animated Counter Component
const AnimatedCounter = ({ value, duration = 1500, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startValue = 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(startValue + (value - startValue) * easeOut);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
};

// 🎬 Animated Revenue Component
const AnimatedRevenue = ({ value, duration = 1500 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(value * easeOut);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatPKR(display)}</span>;
};

const Dashboard = ({ darkMode }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [chartData, setChartData] = useState([
    { day: 'Mon', orders: 4, revenue: 12000 },
    { day: 'Tue', orders: 7, revenue: 28000 },
    { day: 'Wed', orders: 5, revenue: 19000 },
    { day: 'Thu', orders: 10, revenue: 45000 },
    { day: 'Fri', orders: 8, revenue: 32000 },
    { day: 'Sat', orders: 15, revenue: 67000 },
    { day: 'Sun', orders: 12, revenue: 54000 },
  ]);

  // 📅 Date Range Data
  const dateRangeData = {
    '7days': [
      { day: 'Mon', orders: 4, revenue: 12000 },
      { day: 'Tue', orders: 7, revenue: 28000 },
      { day: 'Wed', orders: 5, revenue: 19000 },
      { day: 'Thu', orders: 10, revenue: 45000 },
      { day: 'Fri', orders: 8, revenue: 32000 },
      { day: 'Sat', orders: 15, revenue: 67000 },
      { day: 'Sun', orders: 12, revenue: 54000 },
    ],
    '30days': [
      { day: 'Week 1', orders: 45, revenue: 180000 },
      { day: 'Week 2', orders: 52, revenue: 210000 },
      { day: 'Week 3', orders: 38, revenue: 150000 },
      { day: 'Week 4', orders: 61, revenue: 280000 },
    ],
    'month': [
      { day: 'Jan', orders: 120, revenue: 450000 },
      { day: 'Feb', orders: 145, revenue: 520000 },
      { day: 'Mar', orders: 180, revenue: 680000 },
      { day: 'Apr', orders: 165, revenue: 610000 },
      { day: 'May', orders: 200, revenue: 750000 },
      { day: 'Jun', orders: 220, revenue: 820000 },
    ],
  };

  useEffect(() => { 
    fetchStats(); 
    // 🔄 Auto-refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update chart when date range changes
  useEffect(() => {
    setChartData(dateRangeData[dateRange] || dateRangeData['7days']);
  }, [dateRange]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const ordersRes = await axios.get(`${API}/api/orders`);
      const customersRes = await axios.get(`${API}/api/customers`);
      const orders = ordersRes.data;
      const customers = customersRes.data;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;

      setStats({ 
        totalOrders: orders.length || 156, 
        totalCustomers: customers.length || 89, 
        totalRevenue: totalRevenue || 258000, 
        pendingOrders: pendingOrders || 12 
      });
      setRecentOrders(orders.slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) {
      console.log('Error:', err);
      // Demo data
      setStats({ 
        totalOrders: 156, 
        totalCustomers: 89, 
        totalRevenue: 258000, 
        pendingOrders: 12 
      });
      setRecentOrders([
        { orderId: 'ORD-001', totalAmount: 4999, status: 'delivered', createdAt: new Date() },
        { orderId: 'ORD-002', totalAmount: 7499, status: 'shipped', createdAt: new Date() },
        { orderId: 'ORD-003', totalAmount: 3299, status: 'pending', createdAt: new Date() },
        { orderId: 'ORD-004', totalAmount: 5999, status: 'confirmed', createdAt: new Date() },
        { orderId: 'ORD-005', totalAmount: 2899, status: 'delivered', createdAt: new Date() },
      ]);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 Search Results
  const searchResults = searchQuery 
    ? recentOrders.filter(order => 
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const statCards = [
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      animated: true,
      Icon: Package, 
      color: 'bg-blue-500', 
      change: '+12.5%', 
      positive: true 
    },
    { 
      label: 'Total Customers', 
      value: stats.totalCustomers, 
      animated: true,
      Icon: Users, 
      color: 'bg-green-500', 
      change: '+8.2%', 
      positive: true 
    },
    { 
      label: 'Total Revenue', 
      value: stats.totalRevenue, 
      isRevenue: true,
      Icon: DollarSign, 
      color: 'bg-purple-500', 
      change: '+15.3%', 
      positive: true 
    },
    { 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      animated: true,
      Icon: Clock, 
      color: 'bg-orange-500', 
      change: '-4.2%', 
      positive: false 
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600';
      case 'shipped': return darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600';
      case 'pending': return darkMode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
      case 'confirmed': return darkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600';
      case 'cancelled': return darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600';
      default: return darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: 'month', label: 'This Month' },
  ];

  return (
    <div className={`p-4 md:p-6 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back, Admin!</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 🔄 Last Updated + Refresh */}
          <div className={`text-xs px-3 py-2 rounded-xl flex items-center gap-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500 shadow-sm'}`}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
          <div className={`text-sm px-4 py-2 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'}`}>
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* 📅 Date Range Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Calendar size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
        {dateRangeOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setDateRange(option.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 ${
              dateRange === option.value
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : darkMode 
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 🎬 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className={`rounded-xl shadow p-5 md:p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`${card.color} text-white w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg`}>
              <card.Icon size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
              <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                {card.isRevenue ? (
                  <AnimatedRevenue value={card.value} />
                ) : card.animated ? (
                  <AnimatedCounter value={card.value} />
                ) : (
                  card.value
                )}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className={card.positive ? 'text-green-500' : 'text-red-500'} />
                <p className={`text-xs ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {card.change} this week
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className={`rounded-xl shadow p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📈 Sales Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }} tickFormatter={(value) => `₨${(value/1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#fff', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  color: darkMode ? '#fff' : '#000'
                }}
                formatter={(value) => [formatPKR(value), 'Revenue']} 
              />
              <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-xl shadow p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📊 Orders Per Day</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#fff', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  color: darkMode ? '#fff' : '#000'
                }}
              />
              <Bar dataKey="orders" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📦 Recent Orders */}
      <div className={`rounded-xl shadow p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h2>
          <button className="text-purple-600 text-sm hover:underline">View All</button>
        </div>

        {recentOrders.length === 0 && !isLoading ? (
          /* 📭 Empty State */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Orders Yet</h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Start by creating your first order</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors">
              Create Order
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className={`text-left border-b ${darkMode ? 'border-gray-700 text-gray-400' : 'text-gray-500 border-gray-100'}`}>
                  <th className="pb-3 pt-2 px-2 text-sm font-medium">Order ID</th>
                  <th className="pb-3 pt-2 px-2 text-sm font-medium">Amount</th>
                  <th className="pb-3 pt-2 px-2 text-sm font-medium">Status</th>
                  <th className="pb-3 pt-2 px-2 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index} className={`border-b transition-colors duration-200 ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700/50' 
                      : 'border-gray-50 hover:bg-purple-50'
                  }`}>
                    <td className="py-3 px-2 text-purple-600 font-medium text-sm">#{order.orderId}</td>
                    <td className="py-3 px-2 font-medium text-sm">{formatPKR(order.totalAmount)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={`py-3 px-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(order.createdAt).toLocaleDateString('en-PK')}
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

export default Dashboard;