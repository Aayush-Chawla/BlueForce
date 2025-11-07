import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Building2, Search } from 'lucide-react';
import { useAuth, useEvents } from '../../contexts';
import chatService from '../../services/chatService';
import { eventService } from '../../services/eventService';
import * as userService from '../../services/userService';

const ParticipantChat = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load all NGOs from participant's enrolled events
  useEffect(() => {
    const loadNGOs = async () => {
      if (!user || user.role !== 'participant') return;
      
      setLoading(true);
      try {
        const allNGOs = new Map(); // Use Map to deduplicate by ngoId
        
        // Fetch user's enrolled events
        let enrolledEvents = [];
        try {
          const userEvents = await eventService.getUserEnrolledEvents(user.id);
          enrolledEvents = Array.isArray(userEvents) ? userEvents : (userEvents.events || []);
        } catch (err) {
          console.error('Error fetching enrolled events:', err);
          // Fallback: use events from context if available
          enrolledEvents = events || [];
        }
        
        // If no enrolled events from API, try to get from context
        if (enrolledEvents.length === 0 && events) {
          enrolledEvents = events;
        }
        
        for (const event of enrolledEvents) {
          const ngoId = event.ngoId || event.event?.ngoId;
          if (ngoId && !allNGOs.has(ngoId)) {
            try {
              // Fetch NGO details
              const ngoData = await userService.getUserById(ngoId);
              allNGOs.set(ngoId, {
                id: ngoId,
                name: ngoData.organizationName || ngoData.name || `NGO ${ngoId}`,
                eventId: event.id || event.eventId,
                eventTitle: event.title || event.event?.title || 'Event',
              });
            } catch (err) {
              console.error(`Error fetching NGO ${ngoId}:`, err);
              // Fallback: use event data
              allNGOs.set(ngoId, {
                id: ngoId,
                name: `NGO ${ngoId}`,
                eventId: event.id || event.eventId,
                eventTitle: event.title || event.event?.title || 'Event',
              });
            }
          }
        }
        
        setNgos(Array.from(allNGOs.values()));
      } catch (err) {
        console.error('Error loading NGOs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadNGOs();
  }, [user, events]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user || user.role !== 'participant') return;
      
      try {
        const convos = await chatService.getConversations(user.id);
        setConversations(convos);
      } catch (err) {
        console.error('Error loading conversations:', err);
      }
    };
    
    loadConversations();
  }, [user]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }
      
      try {
        const msgs = await chatService.getMessages(selectedConversation.conversationId);
        setMessages(msgs);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };
    
    loadMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  const handleSelectNGO = async (ngo) => {
    try {
      // Get or create conversation
      const conversation = await chatService.getOrCreateConversation(ngo.id, user.id);
      setSelectedConversation({
        ...conversation,
        ngoName: ngo.name,
        ngoId: ngo.id,
      });
      
      // Reload conversations to get updated list
      const convos = await chatService.getConversations(user.id);
      setConversations(convos);
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sending) return;
    
    setSending(true);
    try {
      const receiverId = selectedConversation.ngoId;
      await chatService.sendMessage({
        senderId: user.id,
        receiverId: receiverId,
        text: messageText,
        ngoId: receiverId,
        participantId: user.id,
      });
      
      setMessageText('');
      // Reload messages
      const msgs = await chatService.getMessages(selectedConversation.conversationId);
      setMessages(msgs);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const filteredNGOs = ngos.filter(ngo =>
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'participant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only participants can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex h-[calc(100vh-8rem)]">
            {/* NGOs List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-sky-500 to-teal-500">
                <div className="flex items-center gap-2 text-white">
                  <Building2 className="w-5 h-5" />
                  <h2 className="text-xl font-bold">NGOs</h2>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search NGOs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading NGOs...</div>
                ) : filteredNGOs.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? 'No NGOs found' : 'No NGOs from your enrolled events'}
                  </div>
                ) : (
                  filteredNGOs.map((ngo) => (
                    <div
                      key={ngo.id}
                      onClick={() => handleSelectNGO(ngo)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-sky-50 transition-colors ${
                        selectedConversation?.ngoId === ngo.id ? 'bg-sky-100' : ''
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{ngo.name}</div>
                      <div className="text-sm text-gray-500">{ngo.eventTitle}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-sky-500 to-teal-500">
                    <div className="flex items-center gap-2 text-white">
                      <MessageCircle className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">{selectedConversation.ngoName}</h3>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isSender = msg.senderId === user.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isSender
                                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white'
                                  : 'bg-white border border-gray-200 text-gray-800'
                              }`}
                            >
                              <div className="text-sm">{msg.text}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  isSender ? 'text-sky-100' : 'text-gray-500'
                                }`}
                              >
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        disabled={sending}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !messageText.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select an NGO to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantChat;

