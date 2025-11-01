import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import chatService from '../services/chatService';

const ChatHelpCenter = () => {
  const [health, setHealth] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const h = await chatService.health();
        setHealth(h);
        const msgs = await chatService.listMessages();
        setMessages(msgs);
      } catch (e) {
        setHealth({ status: 'DOWN' });
      }
    })();
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    const resp = await chatService.sendMessage({ sender: 'user', text });
    setMessages([...(messages || []), resp.data]);
    setText('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-teal-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full inline-flex">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat Help Center</h1>
        <p className="text-gray-600 mb-2">Service status: <span className={health?.status === 'OK' ? 'text-green-600' : 'text-red-600'}>{health?.status || 'UNKNOWN'}</span></p>
        <div className="text-gray-600 mb-4">How can we help you today? Send a message below.</div>
        <div className="border rounded-lg p-3 h-48 overflow-auto text-left mb-3 bg-gray-50">
          {(messages || []).length === 0 ? (
            <div className="text-gray-400 text-sm">No messages yet.</div>
          ) : (
            messages.map(m => (
              <div key={m.id} className="mb-2"><span className="font-semibold">{m.sender}:</span> {m.text}</div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message..." className="flex-1 border rounded-lg px-3 py-2" />
          <button onClick={send} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatHelpCenter; 