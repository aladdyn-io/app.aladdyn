import { Copy, Check, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function GenieScripts() {
  const { genieId } = useParams<{ genieId?: string }>();
  const [copied, setCopied] = useState(false);
  
  const scriptCode = `<!-- Aladdyn AI Chat Widget -->
<script 
  src="https://ai-chat-widget-production.up.railway.app/chatbot.min.js?apiKey=${genieId}"
  async
  defer
></script>`;

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

  if (!genieId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Chat Script</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No Genie ID found. Please select a genie from the dashboard first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat Script</h1>
          <p className="text-sm text-gray-600">Copy and paste this code into your website</p>
        </div>
      </div>
      
      <div className="flex flex-col h-[calc(100vh-11rem)] bg-white rounded-lg border-2 border-gray-200">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Installation Steps */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">How to Install</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Copy the script below</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Click the "Copy Script" button to copy the installation code to your clipboard</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Add to your website</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Paste the script just before the closing <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag in your HTML file</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Save and deploy</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Save your changes and deploy. The chatbot will automatically appear on your website</p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Snippet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Installation Code</h3>
              <Button
                onClick={handleCopyScript}
                size="sm"
                className={`transition-all ${
                  copied 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Script
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                <code>{scriptCode}</code>
              </pre>
            </div>
            
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                💡 <span className="font-semibold">Tip:</span> For best results, place this script at the bottom of your HTML, just before the <code className="bg-white px-1.5 py-0.5 rounded border border-gray-300">&lt;/body&gt;</code> tag
              </p>
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
                  <li>• Your customizations from the Customize page are automatically applied</li>
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
    </div>
  );
}