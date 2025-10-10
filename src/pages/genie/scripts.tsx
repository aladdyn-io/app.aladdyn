import { RotateCcw, MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/ui/components/Button';
import { Label } from '@/ui/components/Label';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/Tabs';
import { Input } from '@/ui/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { useState, useEffect } from 'react';

export function GenieScripts() {
  const [previewUrl, setPreviewUrl] = useState('https://elanenterprises.in/');
  const [textareaValue, setTextareaValue] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);
  const [inputValue, setInputValue] = useState('');

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
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Scripts</h1>
      </div>

      <div className="hidden flex-1 flex-col md:flex">
        <Tabs defaultValue="complete" className="flex flex-1 flex-col ">
          <div className="flex flex-1 flex-col py-6">
            <div className="grid flex-1 items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="hidden flex-col gap-6 sm:flex md:order-2">
                <div className="grid gap-3">
                  <span className="text-sm leading-none font-medium">Mode</span>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="complete">
                      <span className="sr-only">Complete</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                        <rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor" />
                        <rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor" />
                        <rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor" />
                        <rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor" />
                        <rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor" />
                        <rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor" />
                        <rect x="13" y="11" width="3" height="2" rx="1" fill="currentColor" />
                      </svg>
                    </TabsTrigger>
                    <TabsTrigger value="insert">
                      <span className="sr-only">Insert</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z" fill="currentColor" />
                        <rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor" />
                        <rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor" />
                        <rect x="13" y="15" width="3" height="2" rx="1" fill="currentColor" />
                      </svg>
                    </TabsTrigger>
                    <TabsTrigger value="edit">
                      <span className="sr-only">Edit</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                        <rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor" />
                        <rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor" />
                        <rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor" />
                        <rect x="4" y="15" width="4" height="2" rx="1" fill="currentColor" />
                        <rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor" />
                        <path d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z" fill="currentColor" />
                      </svg>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              <div className="flex flex-1 flex-col md:order-1">
                <TabsContent value="complete" className="mt-0 border-0 p-0">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      {showChatbot ? (
                        <iframe
                          src={previewUrl}
                          className="w-full h-[60vh] border border-gray-300 rounded-lg"
                          title="Website Preview"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                      ) : (
                        <textarea
                          value={textareaValue}
                          onChange={(e) => setTextareaValue(e.target.value)}
                          placeholder="Write a tagline for an ice cream shop. Try pasting: https://elanenterprises.in/"
                          className="h-[60vh] w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      )}
                      
                      {/* Mini Chatbot */}
                      {showChatbot && (
                        <>
                          {isChatOpen ? (
                            <div className="absolute bottom-4 right-4 w-72 h-80 z-10">
                              <Card className="h-full flex flex-col shadow-lg bg-white">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b shrink-0">
                                  <CardTitle className="flex items-center gap-2 text-sm">
                                    <Bot className="w-4 h-4 text-emerald-600" />
                                    Website Assistant
                                  </CardTitle>
                                  <Button
                                    variant="ghost"
                                    onClick={() => setIsChatOpen(false)}
                                    className="p-1 h-6 w-6"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    {messages.length === 0 ? (
                                      <div className="text-center text-gray-500 py-4">
                                        <Bot className="w-8 h-8 mx-auto mb-2 text-emerald-600/50" />
                                        <p className="text-xs">Ask me about this website!</p>
                                      </div>
                                    ) : (
                                      messages.map((message) => (
                                        <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                          {message.role === 'assistant' && (
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                              <Bot className="w-3 h-3 text-emerald-600" />
                                            </div>
                                          )}
                                          <div className={`max-w-[75%] rounded-lg px-3 py-2 ${message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                            <p className="text-xs">{message.content}</p>
                                          </div>
                                          {message.role === 'user' && (
                                            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                                              <User className="w-3 h-3 text-white" />
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                  <div className="border-t p-3">
                                    <div className="flex gap-2">
                                      <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask about the website..."
                                        className="flex-1 text-sm h-8"
                                      />
                                      <Button
                                        onClick={handleSendMessage}
                                        className="bg-emerald-600 hover:bg-emerald-700 px-2 py-1 h-8 w-8"
                                      >
                                        <Send className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ) : (
                            <div className="absolute bottom-4 right-4">
                              <div
                                onClick={() => setIsChatOpen(true)}
                                className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors animate-pulse"
                              >
                                <MessageSquare className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    

                    
                    <div className="flex items-center gap-2">
                      <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700">Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="insert" className="mt-0 flex flex-col gap-4 border-0 p-0">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="relative">
                      <textarea
                        value={textareaValue}
                        onChange={(e) => setTextareaValue(e.target.value)}
                        placeholder="We're writing to [insert]. Congrats from Aladdyn! Try pasting: https://elanenterprises.in/"
                        className="h-[60vh] w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      
                      {/* Mini Chatbot */}
                      {showChatbot && (
                        <>
                          {isChatOpen ? (
                            <div className="absolute bottom-4 right-4 w-72 h-80 z-10">
                              <Card className="h-full flex flex-col shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b shrink-0">
                                  <CardTitle className="flex items-center gap-2 text-sm">
                                    <Bot className="w-4 h-4 text-emerald-600" />
                                    Website Assistant
                                  </CardTitle>
                                  <Button
                                    variant="ghost"
                                    onClick={() => setIsChatOpen(false)}
                                    className="p-1 h-6 w-6"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    {messages.length === 0 ? (
                                      <div className="text-center text-gray-500 py-4">
                                        <Bot className="w-8 h-8 mx-auto mb-2 text-emerald-600/50" />
                                        <p className="text-xs">Ask me about this website!</p>
                                      </div>
                                    ) : (
                                      messages.map((message) => (
                                        <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                          {message.role === 'assistant' && (
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                              <Bot className="w-3 h-3 text-emerald-600" />
                                            </div>
                                          )}
                                          <div className={`max-w-[75%] rounded-lg px-3 py-2 ${message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                            <p className="text-xs">{message.content}</p>
                                          </div>
                                          {message.role === 'user' && (
                                            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                                              <User className="w-3 h-3 text-white" />
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                  <div className="border-t p-3">
                                    <div className="flex gap-2">
                                      <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask about the website..."
                                        className="flex-1 text-sm h-8"
                                      />
                                      <Button
                                        onClick={handleSendMessage}
                                        className="bg-emerald-600 hover:bg-emerald-700 px-2 py-1 h-8 w-8"
                                      >
                                        <Send className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ) : (
                            <div className="absolute bottom-4 right-4">
                              <div
                                onClick={() => setIsChatOpen(true)}
                                className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors"
                              >
                                <MessageSquare className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <iframe
                      src={previewUrl}
                      className="w-full h-[60vh] border border-gray-300 rounded-lg"
                      title="Website Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700">Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="mt-0 flex flex-col gap-4 border-0 p-0">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="input" className="sr-only">Input</Label>
                        <textarea
                          id="input"
                          placeholder="We is going to the market."
                          className="h-[50vh] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="instructions">Instructions</Label>
                        <textarea
                          id="instructions"
                          placeholder="Fix the grammar."
                          className="p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          rows={3}
                        />
                      </div>
                    </div>
                    <iframe
                      src={previewUrl}
                      className="w-full h-[60vh] border border-gray-300 rounded-lg"
                      title="Website Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700">Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}