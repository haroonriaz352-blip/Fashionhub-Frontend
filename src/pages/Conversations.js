import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchConversations(); }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/conversations');
      setConversations(res.data);
    } catch (err) {
      console.log(err);
      // Demo data for now
      setConversations([
        { _id: '1', customerName: 'Ahmed Khan', platform: 'instagram', lastMessage: 'Do you have black dress?', time: '2 min ago', status: 'active' },
        { _id: '2', customerName: 'Sara Ali', platform: 'whatsapp', lastMessage: 'Price of maxi?', time: '5 min ago', status: 'resolved' },
        { _id: '3', customerName: 'Zain Malik', platform: 'instagram', lastMessage: 'Delivery charges?', time: '10 min ago', status: 'active' },
        { _id: '4', customerName: 'Fatima Khan', platform: 'whatsapp', lastMessage: 'XL available?', time: '15 min ago', status: 'pending' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Conversations</h1>
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
            {conversations.filter(c => c.status === 'active').length} Active
          </span>
          <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm">
            {conversations.filter(c => c.status === 'pending').length} Pending
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        {loading ? (
          <p className="text-center py-8 text-gray-400">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-center py-8 text-gray-400">No conversations yet</p>
        ) : (
          <div className="divide-y">
            {conversations.map((conv) => (
              <div key={conv._id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    {conv.customerName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{conv.customerName || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    conv.platform === 'instagram' ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {conv.platform === 'instagram' ? '📸 Instagram' : '💬 WhatsApp'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    conv.status === 'active' ? 'bg-green-100 text-green-600' :
                    conv.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {conv.status}
                  </span>
                  <span className="text-xs text-gray-400">{conv.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;