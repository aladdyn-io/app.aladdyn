import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';

export function TrainGenie() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Train Genie</h1>
        <p className="mt-1 text-sm text-gray-500">
          Train and customize your AI Genies with specific knowledge and behaviors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genie Name</label>
                <Input placeholder="My Custom Genie" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Chatbot</option>
                  <option>Lead Generator</option>
                  <option>Support Agent</option>
                  <option>Content Creator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Knowledge Base</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                  placeholder="Upload documents or paste training data..."
                />
              </div>
              <Button className="w-full">Start Training</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>LeadBot Training</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>SupportBot Training</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>EmailBot Training</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
