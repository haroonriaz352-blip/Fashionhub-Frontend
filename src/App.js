import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Conversations from './pages/Conversations';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  // ✅ ADDED

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>

        {/* 📱 Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:static
          z-50 md:z-auto
          transition-transform duration-300
          h-full
        `}>
          <Sidebar darkMode={darkMode} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Navbar 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            onMenuToggle={toggleSidebar}
            searchQuery={searchQuery}           // ✅ ADDED
            setSearchQuery={setSearchQuery}     // ✅ ADDED
          />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard darkMode={darkMode} />} />
              <Route path="/products" element={<Products darkMode={darkMode} />} />
              <Route path="/orders" element={<Orders darkMode={darkMode} />} />
              <Route path="/customers" element={<Customers darkMode={darkMode} />} />
              <Route path="/conversations" element={<Conversations darkMode={darkMode} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;