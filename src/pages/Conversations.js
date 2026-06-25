import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Loader2, MessageCircle, Send, Camera, MessageSquare, 
  AlertCircle, Search, ChevronRight
} from 'lucide-react';

const API = 'https://fashionhubdemo-production.up.railway.app';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchConversations(); }, []);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/conversations`);
      setConversations(res.data);
    } catch (err) {
      console.log(err);
      setConversations([
        { _id: '1', customerName: 'Ahmed Khan', platform: 'instagram', lastMessage: 'Do you have black dress?', time: '2 min ago', status: 'active', unread: true },
        { _id: '2', customerName: 'Sara Ali', platform: 'whatsapp', lastMessage: 'Price of maxi?', time: '5 min ago', status: 'resolved', unread: false },
        { _id: '3', customerName: 'Zain Malik', platform: 'instagram', lastMessage: 'Delivery charges?', time: '10 min ago', status: 'active', unread: true },
        { _id: '4', customerName: 'Fatima Khan', platform: 'whatsapp', lastMessage: 'XL available?', time: '15 min ago', status: 'pending', unread: false },
        { _id: '5', customerName: 'Ayesha Ahmed', platform: 'instagram', lastMessage: 'Can I get discount?', time: '25 min ago', status: 'active', unread: true },
        { _id: '6', customerName: 'Bilal Hassan', platform: 'whatsapp', lastMessage: 'Order status please?', time: '1 hour ago', status: 'resolved', unread: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    setReplyText('');
    alert('Reply sent! (Demo mode)');
  };

  const handleStatusChange = (id, newStatus) => {
    setConversations(prev => prev.map(c => 
      c._id === id ? { ...c, status: newStatus } : c
    ));
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    const matchesSearch = conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusConfig = (status) => {
    switch(status) {
      case 'active': return { color: 'bg-green-100 text-green-600 border-green-200', label: 'Active' };
      case 'pending': return { color: 'bg-yellow-100 text-yellow-600 border-yellow-200', label: 'Pending' };
      case 'resolved': return { color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Resolved' };
      default: return { color: 'bg-gray-100 text-gray-600', label: status };
    }
  };

  const getPlatformIcon = (platform) => {
    return platform === 'instagram' 
      ? <Camera size={14} className="text-pink-500" />
      : <MessageSquare size={14} className="text-green-500" />;
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-80px)]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Conversations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer messages</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-green-100 text-green-600 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {conversations.filter(c => c.status === 'active').length} Active
          </span>
          <span className="bg-yellow-100 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-medium">
            {conversations.filter(c => c.status === 'pending').length} Pending
          </span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">
            {conversations.filter(c => c.status === 'resolved').length} Resolved
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100%-100px)]">
        <div className="lg:w-1/3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 border border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    filterStatus === status 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-purple-500 mb-2" />
                <p className="text-gray-400 text-sm">Loading conversations...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
                <p className="text-gray-500 text-sm">{error}</p>
                <button onClick={fetchConversations} className="mt-3 text-purple-600 text-sm hover:underline">
                  Try Again
                </button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 text-sm">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const statusConfig = getStatusConfig(conv.status);
                return (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-purple-50/50 ${
                      selectedConv?._id === conv._id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                    } ${conv.unread ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                          {conv.customerName?.charAt(0) || '?'}
                        </div>
                        {conv.unread && (
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-800 text-sm truncate">{conv.customerName}</h4>
                          <span className="text-xs text-gray-400 flex-shrink-0">{conv.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            {getPlatformIcon(conv.platform)}
                            <span className="capitalize">{conv.platform}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-2" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:w-2/3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    {selectedConv.customerName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedConv.customerName}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {getPlatformIcon(selectedConv.platform)}
                      <span className="capitalize">{selectedConv.platform}</span>
                      <span>•</span>
                      <span>{selectedConv.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedConv.status}
                    onChange={(e) => handleStatusChange(selectedConv._id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs flex-shrink-0">
                    {selectedConv.customerName?.charAt(0) || '?'}
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                    <p className="text-sm text-gray-700">{selectedConv.lastMessage}</p>
                    <span className="text-xs text-gray-400 mt-1 block">{selectedConv.time}</span>
                  </div>
                </div>

                <div className="flex gap-3 mb-4 flex-row-reverse">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    A
                  </div>
                  <div className="bg-purple-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm max-w-[80%]">
                    <p className="text-sm text-white">Thank you for reaching out! How can I help you today?</p>
                    <span className="text-xs text-purple-200 mt-1 block">Just now</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                    placeholder="Type your reply..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={16} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={40} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Conversation</h3>
                <p className="text-gray-500 max-w-xs">Click on a conversation from the list to view details and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;