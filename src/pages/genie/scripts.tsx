export function GenieScripts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Scripts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize your chatbot appearance and styling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Chatbot Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chatbot Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4 h-96">
            {/* Chat Header */}
            <div className="bg-emerald-600 text-white p-3 rounded-t-lg flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">AI</span>
              </div>
              <div>
                <h4 className="font-medium">Genie Assistant</h4>
                <p className="text-xs text-emerald-100">Online</p>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="bg-white p-4 space-y-3 h-64 overflow-y-auto">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-800">Hello! How can I help you today?</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 justify-end">
                <div className="bg-emerald-600 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">I need help with my account</p>
                </div>
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="bg-white border-t p-3 rounded-b-lg">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Styling Editor */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chatbot Styling</h3>
          <div className="space-y-6">
            {/* Theme Colors */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Theme Colors</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value="#059669" className="w-10 h-10 rounded border" />
                    <input type="text" value="#059669" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value="#ffffff" className="w-10 h-10 rounded border" />
                    <input type="text" value="#ffffff" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Typography</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Inter</option>
                    <option>Arial</option>
                    <option>Helvetica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Small (12px)</option>
                    <option>Medium (14px)</option>
                    <option>Large (16px)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Widget Position */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Widget Position</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Bottom Right</button>
                <button className="p-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Bottom Left</button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}