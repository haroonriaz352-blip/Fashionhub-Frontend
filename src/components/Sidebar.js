import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  MessageSquare, 
  LogOut,
  Shirt
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: ShoppingBag },
    { path: '/orders', label: 'Orders', icon: Package },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/conversations', label: 'Conversations', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Shirt size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">FashionHub</h1>
            <p className="text-gray-400 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl w-full transition-all duration-200">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;