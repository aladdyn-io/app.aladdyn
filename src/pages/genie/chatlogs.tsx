import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const chatData = {
  "conversations": [
    {
      "conversation_id": "conv_001",
      "title": "Project Alpha Planning",
      "source": "whatsapp",
      "created_at": "2025-10-01T09:00:00Z",
      "messages": [
        { "message_id": "msg_001", "sender_id": "u_001", "text": "Hey Bob, ready to kick off Project Alpha?", "timestamp": "2025-10-01T09:01:00Z" },
        { "message_id": "msg_002", "sender_id": "u_002", "text": "Absolutely, I reviewed the draft yesterday.", "timestamp": "2025-10-01T09:02:30Z" },
        { "message_id": "msg_003", "sender_id": "u_001", "text": "Perfect, let's set up the first meeting.", "timestamp": "2025-10-01T09:03:20Z" },
        { "message_id": "msg_004", "sender_id": "u_002", "text": "I'll send out invites for 2 PM.", "timestamp": "2025-10-01T09:04:15Z" },
        { "message_id": "msg_005", "sender_id": "u_001", "text": "Sounds good, I'll prepare the agenda.", "timestamp": "2025-10-01T09:05:40Z" }
      ]
    },
    {
      "conversation_id": "conv_002",
      "title": "UI Design Feedback",
      "source": "instagram",
      "created_at": "2025-10-02T10:00:00Z",
      "messages": [
        { "message_id": "msg_021", "sender_id": "u_004", "text": "Uploaded new UI mockups to Figma.", "timestamp": "2025-10-02T10:05:00Z" },
        { "message_id": "msg_022", "sender_id": "u_003", "text": "Looks better! The spacing is much cleaner.", "timestamp": "2025-10-02T10:07:00Z" }
      ]
    },
    {
      "conversation_id": "conv_003",
      "title": "Website Support Inquiry",
      "source": "website",
      "created_at": "2025-10-03T11:00:00Z",
      "messages": [
        { "message_id": "msg_041", "sender_id": "u_006", "text": "Hi, my order isn't showing in my account.", "timestamp": "2025-10-03T11:01:00Z" },
        { "message_id": "msg_042", "sender_id": "support_01", "text": "Thanks for reaching out! Can you share your order number?", "timestamp": "2025-10-03T11:02:20Z" }
      ]
    }
  ]
};

const getSourceIcon = (source: string) => {
  const icons = {
    whatsapp: '💬',
    instagram: '📷',
    website: '🌐'
  };
  return icons[source as keyof typeof icons] || '💬';
};

const getSourceColor = (source: string) => {
  const colors = {
    whatsapp: 'text-emerald-600',
    instagram: 'text-purple-600',
    website: 'text-blue-600'
  };
  return colors[source as keyof typeof colors] || 'text-emerald-600';
};

export function ChatLogs() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const filteredConversations = chatData.conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.conversation_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
          Chat Logs
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and analyze all chat sessions between users and your AI genies.
        </p>
      </div>

      <div className="h-96 bg-white rounded-xl shadow-sm border border-gray-200 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-gradient-to-b from-emerald-50 to-emerald-100 border-r border-emerald-200 rounded-l-xl">
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-gray-900 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            
            {/* Conversation List */}
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.conversation_id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.conversation_id === conv.conversation_id
                      ? 'border-l-4 border-emerald-500 bg-emerald-100'
                      : 'hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg ${getSourceColor(conv.source)}`}>
                      {getSourceIcon(conv.source)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">{conv.conversation_id}</p>
                      <p className="text-gray-500 text-sm">{conv.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-tr-xl">
                <div className="flex items-center space-x-3">
                  <span className={`text-lg ${getSourceColor(selectedConversation.source)}`}>
                    {getSourceIcon(selectedConversation.source)}
                  </span>
                  <div>
                    <h2 className="text-gray-900 font-semibold">{selectedConversation.conversation_id}</h2>
                    <p className="text-gray-500 text-sm">{selectedConversation.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`flex ${message.sender_id.startsWith('u_') ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id.startsWith('u_')
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id.startsWith('u_') ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl text-emerald-600 mb-4">💬</div>
                      <p className="text-gray-500">No messages in this conversation</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="text-6xl text-emerald-600 mb-4">💬</div>
                <p className="text-gray-600 text-lg font-medium">Select a conversation to view messages</p>
                <p className="text-gray-500 text-sm mt-2">Click on any conversation from the sidebar to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}