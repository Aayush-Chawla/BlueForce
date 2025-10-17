import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatHelpButton = () => (
  <a
    href="/chat-help-center"
    className="fixed z-50 bottom-6 right-6 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 hover:from-sky-600 hover:to-teal-600 transition-all group"
    aria-label="Chat Help Center"
    style={{ boxShadow: '0 4px 24px 0 rgba(0, 180, 216, 0.15)' }}
  >
    <MessageCircle className="w-8 h-8" />
    <span className="sr-only">Chat Help Center</span>
    <span className="absolute bottom-20 right-0 bg-white text-sky-700 text-xs font-semibold px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Need help?</span>
  </a>
);

export default ChatHelpButton;


