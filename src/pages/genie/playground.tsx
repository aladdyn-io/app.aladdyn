import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';

export function GeniePlayground() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Genie Playground</h1>
        <p className="mt-1 text-sm text-gray-500">
          Test and experiment with your AI Genies in a safe environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chat Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                <div className="space-y-2">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <p className="text-sm">Welcome to the Genie Playground! How can I help you today?</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Genie Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Genie</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>LeadBot</option>
                  <option>SupportBot</option>
                  <option>EmailBot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                <input type="range" min="0" max="1" step="0.1" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                <Input type="number" placeholder="1000" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
