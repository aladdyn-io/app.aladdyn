import { Send, Bot, Eye } from 'lucide-react';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';
import { useState, useEffect } from 'react';

export function GenieScripts() {
  const [previewUrl, setPreviewUrl] = useState('https://elanenterprises.in/');
  const [textareaValue] = useState('');
  const [_showChatbot, setShowChatbot] = useState(false);
  const [_isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeView, setActiveView] = useState<'chat' | 'website' | 'preview'>('preview');
  const [,] = useState({
    botName: 'Support Bot',
    botStatus: 'Always online',
    headerBg: '#0d47a1',
    headerText: '#ffffff',
    botBubbleBg: '#e3f2fd',
    botBubbleText: '#0d47a1',
    userBubbleBg: 'linear-gradient(135deg, #43a047, #1b5e20)',
    userBubbleText: '#ffffff',
    bgFrom: '#e3f2fd',
    bgTo: '#ede7f6',
    chatBg: 'linear-gradient(135deg, #e3f2fd, #ede7f6)',
    fontSize: '16px',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    botAvatar: 'https://i.pravatar.cc/150?img=1',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    inputBg: '#ffffff',
    inputBorder: '1px solid #64b5f6',
    inputText: '#212121',
    inputPlaceholder: '#9e9e9e',
    buttonBg: 'linear-gradient(135deg, #43a047, #1b5e20)',
    buttonText: '#ffffff',
    buttonShadow: '0px 2px 6px rgba(76, 175, 80, 0.3)',
    buttonHover: 'linear-gradient(135deg, #388e3c, #2e7d32)',
    borderRadius: '12px',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    welcomeMessage: 'Hi! How can I help you today?',
    placeholder: 'Type your message...'
  });

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  useEffect(() => {
    const urls = textareaValue.match(urlRegex);
    if (urls && urls.length > 0) {
      setPreviewUrl(urls[0]);
      setShowChatbot(true);
    } else {
      setShowChatbot(false);
      setIsChatOpen(false);
    }
  }, [textareaValue]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `I can help you with questions about ${previewUrl}. What would you like to know?`
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Scripts</h1>
         {/* Chat/Website/Preview Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveView('chat')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeView === 'chat'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveView('website')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeView === 'website'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Website
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
              activeView === 'preview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>
      
      <div className='bg-black h-[calc(100vh-11rem)] w-full '>
      

        {/* Content based on active view */}
        {activeView === 'preview' ? (
          <div className="h-full w-full ">
            <iframe 
              src="/chatbot-preview.html" 
              className="w-full h-full border-0 rounded-lg"
              title="Chatbot Widget Preview"
            />
          </div>
        ) : activeView === 'chat' ? (
          <div className="bg-white rounded-lg border border-gray-200 h-full w-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Support Bot</h3>
                  <p className="text-xs opacity-80">Always online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-700">Hi! How can I help you today?</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 max-w-xs ${
                      message.role === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-700'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white w-full h-full rounded-lg border border-gray-200 p-4">
            <iframe
              src={previewUrl}
              className=" border h-full w-full border-gray-300 rounded-lg"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}

      </div>
    </div>
  );
}