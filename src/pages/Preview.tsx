import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, X, ExternalLink, Send, Loader2, Bot, User } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/ui/components'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function Preview() {
  const { url } = useParams<{ url: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [decodedUrl, setDecodedUrl] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [websiteId, setWebsiteId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    if (!url) {
      navigate('/')
      return
    }

    // Decode the URL parameter
    const decoded = decodeURIComponent(url)
    setDecodedUrl(decoded)
    
    // Get websiteId from localStorage or generate new one
    const storedId = localStorage.getItem('currentWebsiteId')
    setWebsiteId(storedId || Date.now().toString())
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [url, navigate])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsSending(true)

    try {
      // Call chat API
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: websiteId,
          query: inputValue,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const cleanUrl = decodedUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')
  const fullUrl = decodedUrl.startsWith('http') ? decodedUrl : `https://${decodedUrl}`

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Website Preview...</h2>
          <p className="text-gray-600">{cleanUrl}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4 h-full">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-sm font-medium text-gray-600">{cleanUrl}</span>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-full">
              <span className="text-sm font-medium">AI Agent Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(fullUrl, '_blank')}
              className="gap-2 flex items-center"
            >
              <ExternalLink className="w-4 h-4" />
              Open Original
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2 flex items-center"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {isChatOpen ? (
        <div className="fixed bottom-4 right-4 z-20 w-72 h-80 flex flex-col">
          <Card className="h-full flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b shrink-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot className="w-4 h-4 text-emerald-600" />
                AI Agent
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => setIsChatOpen(false)}
                className="p-1 h-6 w-6 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Bot className="w-8 h-8 mx-auto mb-2 text-emerald-600/50" />
                    <p className="text-xs">Hi! I'm your AI assistant.</p>
                    <p className="text-xs">Ask me anything about this website!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Bot className="w-3 h-3 text-emerald-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-xs whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 flex items-center justify-center shrink-0">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-3 shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Ask a question..."
                    disabled={isSending}
                    className="flex-1 text-sm h-8"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !inputValue.trim()}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 px-2 py-1 h-8 w-8 flex items-center justify-center"
                  >
                    {isSending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="fixed bottom-4 right-4 z-20">
          <div
            onClick={() => setIsChatOpen(true)}
            className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:from-emerald-700 hover:to-emerald-900 transition-colors animate-pulse"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      {/* Website Iframe */}
      <div className="absolute top-16 left-0 right-0 bottom-0">
        <iframe
          src={fullUrl}
          className="w-full h-full border-0"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  )
}
