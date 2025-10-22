import { Eye, Copy, Check, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { CustomizeSection } from '@/components/CustomizeSection';
import { getCurrentGenieId } from '@/lib/utils';
import { toast } from 'sonner';

export function GenieScripts() {
  const genieId = getCurrentGenieId();
  const [previewUrl, setPreviewUrl] = useState('https://elanenterprises.in/');
  const [textareaValue] = useState('');
  const [_showChatbot, setShowChatbot] = useState(false);
  const [_isChatOpen, setIsChatOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'website' | 'customize'>('customize');
  const [copied, setCopied] = useState(false);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  const scriptCode = `<script src="https://ai-chat-widget-production.up.railway.app/chatbot.min.js?apiKey=${genieId}"></script>`;

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(scriptCode);
      setCopied(true);
      toast.success('Script copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy script');
      console.error('Copy failed:', error);
    }
  };

  useEffect(() => {
    const urls = textareaValue.match(urlRegex);
    if (urls && urls.length > 0) {
      setPreviewUrl(urls[0]);
      setShowChatbot(true);
    } else {
      setShowChatbot(false);
      setIsChatOpen(false);
    }
  }, [textareaValue, urlRegex]);

  if (!genieId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Scripts</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No Genie ID found. Please select a genie from the dashboard first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Scripts</h1>
         {/* Chat/Website/Customize Toggle */}
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
            onClick={() => setActiveView('customize')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
              activeView === 'customize'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Eye className="h-4 w-4" />
            Customize
          </button>
        </div>
      </div>
      
      <div className=' h-[calc(100vh-11rem)] w-full '>
      

        {/* Content based on active view */}
        {activeView === 'customize' ? (
          <div className="h-full w-full overflow-auto bg-white rounded-lg">
            {genieId && <CustomizeSection websiteData={null} genieId={genieId} />}
          </div>
        ) : activeView === 'chat' ? (
          <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Widget Installation Script</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Copy and paste this code into your website's HTML</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Installation Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Copy the script below</h3>
                    <p className="text-sm text-gray-600">This code snippet initializes your AI chatbot widget</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Paste before closing &lt;/body&gt; tag</h3>
                    <p className="text-sm text-gray-600">Add the script just before the closing body tag in your HTML</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save and deploy</h3>
                    <p className="text-sm text-gray-600">Your chatbot will automatically appear on your website</p>
                  </div>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Installation Script</Label>
                <div className="relative group">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 overflow-x-auto">
                    <code className="text-sm text-emerald-400 font-mono whitespace-pre">
                      {scriptCode}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopyScript}
                    size="sm"
                    className={`absolute top-3 right-3 transition-all ${
                      copied 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy Script
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    i
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900">Integration Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1.5">
                      <li>• The chatbot will automatically load when your page loads</li>
                      <li>• It works on all modern browsers (Chrome, Firefox, Safari, Edge)</li>
                      <li>• The widget is mobile-responsive and adapts to all screen sizes</li>
                      <li>• Your customizations from the Customize tab are automatically applied</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* API Key Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Your API Key</h4>
                    <p className="text-sm text-gray-600 mb-2">This unique identifier connects the widget to your chatbot</p>
                    <div className="bg-white border border-gray-300 rounded px-3 py-2 font-mono text-sm text-gray-800 break-all">
                      {genieId}
                    </div>
                  </div>
                </div>
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