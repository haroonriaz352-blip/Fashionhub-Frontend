import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, ChevronDown, User, Settings, LogOut, 
  Moon, Sun, Plus, X, Menu 
} from 'lucide-react';

const Navbar = ({ 
  darkMode = false, 
  toggleDarkMode = () => {}, 
  onMenuToggle = () => {}, 
  searchQuery = '', 
  setSearchQuery = () => {},
  searchResults = []  // ✅ Default empty array
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order received #ORD-001', time: '2 min ago', unread: true },
    { id: 2, text: 'Customer message on Instagram', time: '5 min ago', unread: true },
    { id: 3, text: 'Product stock low: Black Maxi', time: '10 min ago', unread: false },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);

  // 🔔 Auto-fetch notifications every 30 seconds
  useEffect(() => {
    const fetchNotifications = () => {
      const newNotif = { 
        id: Date.now(), 
        text: `New activity at ${new Date().toLocaleTimeString()}`, 
        time: 'Just now', 
        unread: true 
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
    };

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm px-4 md:px-6 py-3 flex justify-between items-center relative transition-colors duration-300`}>

      {/* Left Side - Mobile Menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* 📱 Mobile Menu Button */}
        <button 
          onClick={onMenuToggle}
          className={`md:hidden p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
        >
          <Menu size={22} />
        </button>

        {/* 🔍 Functional Search Bar */}
        <div className={`relative flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl px-4 py-2 w-full max-w-md transition-colors`}>
          <Search size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} mr-2 flex-shrink-0`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, customers, products..."
            className={`bg-transparent outline-none text-sm w-full ${darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-600 placeholder-gray-400'}`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`ml-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X size={16} />
            </button>
          )}

          {/* 🔍 Search Results Dropdown */}
          {searchQuery && searchResults && searchResults.length > 0 && (
            <div className={`absolute left-0 right-0 top-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl rounded-xl z-50 border max-h-64 overflow-y-auto`}>
              <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : ''}`}>
                <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {searchResults.length} results found
                </p>
              </div>
              {searchResults.map((result, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 border-b cursor-pointer transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <p className="text-sm font-medium">{result.orderId || result.name || 'Result'}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {result.status || 'Item'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-yellow-400' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* ➕ Quick Actions */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => { setShowQuickActions(!showQuickActions); setShowNotifications(false); setShowDropdown(false); }}
            className={`p-2 rounded-xl transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-purple-400' 
                : 'hover:bg-purple-100 text-purple-600'
            }`}
          >
            <Plus size={22} />
          </button>

          {showQuickActions && (
            <div className={`absolute right-0 top-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl rounded-xl w-52 z-50 border`}>
              <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : ''}`}>
                <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Quick Add</h3>
              </div>
              <button className={`flex items-center gap-3 px-4 py-3 w-full text-left text-sm transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
              }`}>
                <span className="text-lg">📦</span> New Order
              </button>
              <button className={`flex items-center gap-3 px-4 py-3 w-full text-left text-sm transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
              }`}>
                <span className="text-lg">👤</span> New Customer
              </button>
              <button className={`flex items-center gap-3 px-4 py-3 w-full text-left text-sm transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
              }`}>
                <span className="text-lg">🏷️</span> Add Product
              </button>
            </div>
          )}
        </div>

        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); setShowQuickActions(false); }}
            className={`relative p-2 rounded-xl transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 top-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl rounded-xl w-80 z-50 border`}>
              <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : ''}`}>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Notifications</h3>
                <button 
                  onClick={markAllRead}
                  className="text-xs text-purple-500 hover:text-purple-700"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n.id)}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      darkMode 
                        ? `border-gray-700 ${n.unread ? 'bg-purple-900/30' : 'hover:bg-gray-700'} text-gray-300` 
                        : `${n.unread ? 'bg-purple-50' : 'hover:bg-gray-50'} text-gray-700`
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {n.unread && <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />}
                      <div className={n.unread ? '' : 'ml-4'}>
                        <p className="text-sm">{n.text}</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 text-center border-t ${darkMode ? 'border-gray-700' : ''}`}>
                <button className="text-purple-600 text-sm hover:underline">View All</button>
              </div>
            </div>
          )}
        </div>

        {/* 👤 Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); setShowQuickActions(false); }}
            className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className={`hidden md:block font-medium text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Admin</span>
            <ChevronDown size={16} className={`${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </button>

          {showDropdown && (
            <div className={`absolute right-0 top-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl rounded-xl w-48 z-50 border`}>
              <button className={`flex items-center gap-3 px-4 py-3 w-full text-left text-sm transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
              }`}>
                <User size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                Profile
              </button>
              <button className={`flex items-center gap-3 px-4 py-3 w-full text-left text-sm transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
              }`}>
                <Settings size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                Settings
              </button>
              <hr className={darkMode ? 'border-gray-700' : ''} />
              <button className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-sm text-red-500">
                <LogOut size={16} className="text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;