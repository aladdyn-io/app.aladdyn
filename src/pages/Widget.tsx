import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Widget() {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState({
    botName: 'Support Bot',
    botStatus: 'Always online',
    headerBg: '#0d47a1',
    headerText: '#ffffff',
    botBubbleBg: '#e3f2fd',
    botBubbleText: '#0d47a1',
    userBubbleBg: 'linear-gradient(135deg, #43a047, #1b5e20)',
    userBubbleText: '#ffffff',
    welcomeMessage: 'Hi! How can I help you today?',
    placeholder: 'Type your message...'
  });

  useEffect(() => {
    const newConfig = { ...config };
    searchParams.forEach((value, key) => {
      if (value) newConfig[key as keyof typeof config] = value;
    });
    setConfig(newConfig);
  }, [searchParams]);

  return (
    <div className="min-h-screen p-4" style={{ 
      background: `linear-gradient(135deg, ${searchParams.get('bgFrom') || '#e3f2fd'}, ${searchParams.get('bgTo') || '#ede7f6'})` 
    }}>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-center gap-3" style={{ 
          background: config.headerBg, 
          color: config.headerText 
        }}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            🤖
          </div>
          <div>
            <div className="font-semibold">{config.botName}</div>
            <div className="text-sm opacity-80">{config.botStatus}</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-96 p-4 overflow-y-auto">
          {/* Welcome Message */}
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              🤖
            </div>
            <div 
              className="max-w-xs p-3 rounded-lg"
              style={{ 
                background: config.botBubbleBg, 
                color: config.botBubbleText 
              }}
            >
              {config.welcomeMessage}
            </div>
          </div>

          {/* Sample User Message */}
          <div className="flex gap-3 mb-4 justify-end">
            <div 
              className="max-w-xs p-3 rounded-lg"
              style={{ 
                background: config.userBubbleBg, 
                color: config.userBubbleText 
              }}
            >
              Hello! I need help with my account.
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
              U
            </div>
          </div>

          {/* Sample Bot Response */}
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              🤖
            </div>
            <div 
              className="max-w-xs p-3 rounded-lg"
              style={{ 
                background: config.botBubbleBg, 
                color: config.botBubbleText 
              }}
            >
              I'd be happy to help you with your account! What specific issue are you experiencing?
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={config.placeholder}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: searchParams.get('inputBg') || '#ffffff',
                color: searchParams.get('inputText') || '#212121',
                border: searchParams.get('inputBorder') || '1px solid #64b5f6'
              }}
            />
            <button 
              className="px-4 py-3 rounded-lg text-white font-medium"
              style={{ 
                background: config.userBubbleBg,
                boxShadow: searchParams.get('buttonShadow') || '0px 2px 6px rgba(76, 175, 80, 0.3)'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}