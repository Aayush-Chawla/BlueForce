import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Users, Search } from 'lucide-react';
import { useAuth, useEvents } from '../../contexts';
import chatService from '../../services/chatService';
import { eventService } from '../../services/eventService';
import * as userService from '../../services/userService';

const NGOChat = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load all participants from NGO's events
  useEffect(() => {
    const loadParticipants = async () => {
      if (!user || user.role !== 'ngo' || !events) return;
      
      setLoading(true);
      try {
        const ngoEvents = events.filter(event => event.ngoId === user.id);
        const allParticipants = new Map(); // Use Map to deduplicate by userId
        
        for (const event of ngoEvents) {
          try {
            const eventParticipants = await eventService.getEventParticipants(event.id);
            const participantsList = Array.isArray(eventParticipants) 
              ? eventParticipants 
              : (eventParticipants.participants || []);
            
            participantsList.forEach(participant => {
              const userId = participant.userId || participant.id;
              if (userId && !allParticipants.has(userId)) {
                allParticipants.set(userId, {
                  id: userId,
                  name: participant.userName || `Participant ${userId}`,
                  eventId: event.id,
                  eventTitle: event.title,
                });
              }
            });
          } catch (err) {
            console.error(`Error fetching participants for event ${event.id}:`, err);
          }
        }
        
        setParticipants(Array.from(allParticipants.values()));
      } catch (err) {
        console.error('Error loading participants:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadParticipants();
  }, [user, events]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user || user.role !== 'ngo') return;
      
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

  const handleSelectParticipant = async (participant) => {
    try {
      // Get or create conversation
      const conversation = await chatService.getOrCreateConversation(user.id, participant.id);
      setSelectedConversation({
        ...conversation,
        participantName: participant.name,
        participantId: participant.id,
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
      const receiverId = selectedConversation.participantId;
      await chatService.sendMessage({
        senderId: user.id,
        receiverId: receiverId,
        text: messageText,
        ngoId: user.id,
        participantId: receiverId,
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

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'ngo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only NGO organizers can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex h-[calc(100vh-8rem)]">
            {/* Participants List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-sky-500 to-teal-500">
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Participants</h2>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading participants...</div>
                ) : filteredParticipants.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? 'No participants found' : 'No participants from your events'}
                  </div>
                ) : (
                  filteredParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      onClick={() => handleSelectParticipant(participant)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-sky-50 transition-colors ${
                        selectedConversation?.participantId === participant.id ? 'bg-sky-100' : ''
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{participant.name}</div>
                      <div className="text-sm text-gray-500">{participant.eventTitle}</div>
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
                      <h3 className="text-lg font-semibold">{selectedConversation.participantName}</h3>
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
                    <p className="text-lg">Select a participant to start chatting</p>
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

export default NGOChat;

