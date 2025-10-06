import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';

export function GenieSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Genie Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your Genie workspace settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                <Input placeholder="My Genie Workspace" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Model</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>GPT-4</option>
                  <option>GPT-3.5 Turbo</option>
                  <option>Claude</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <Input type="password" placeholder="sk-..." />
              </div>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Training Complete</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">New Leads</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">System Updates</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
