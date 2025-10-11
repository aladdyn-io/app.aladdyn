import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  config?: {
    botName?: string;
    botStatus?: string;
    headerBg?: string;
    headerText?: string;
    botBubbleBg?: string;
    botBubbleText?: string;
    userBubbleBg?: string;
    userBubbleText?: string;
    welcomeMessage?: string;
    placeholder?: string;
  };
}

export function ChatWidget({ isOpen, onClose, config = {} }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: config.welcomeMessage || 'Hi! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! How else can I assist you?',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div 
        className="p-4 rounded-t-lg flex items-center justify-between"
        style={{ 
          backgroundColor: config.headerBg || '#0d47a1',
          color: config.headerText || '#ffffff'
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h3 className="font-semibold">{config.botName || 'Support Bot'}</h3>
            <p className="text-xs opacity-80">{config.botStatus || 'Always online'}</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-xs px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: message.sender === 'user' 
                  ? config.userBubbleBg || 'linear-gradient(135deg, #43a047, #1b5e20)'
                  : config.botBubbleBg || '#e3f2fd',
                color: message.sender === 'user'
                  ? config.userBubbleText || '#ffffff'
                  : config.botBubbleText || '#0d47a1'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={config.placeholder || 'Type your message...'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Website Chat Button Component
export function WebsiteChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center z-40"
        >
          💬
        </button>
      )}
      
      <ChatWidget 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}