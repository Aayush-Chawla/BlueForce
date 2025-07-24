import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatHelpCenter = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-teal-50 px-4 py-12">
    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full inline-flex">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat Help Center</h1>
      <p className="text-gray-600 mb-4">How can we help you today? Our team is here to assist you with any questions or issues you may have.</p>
      <div className="text-gray-400 text-sm">(Chat functionality coming soon!)</div>
    </div>
  </div>
);

export default ChatHelpCenter; 