import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Mail, Calendar, MessageCircle, Instagram, Plug2 } from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  emailAddress?: string;
}

export function GenieIntegrations() {
  const { genieId } = useParams<{ genieId?: string }>();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'mail',
      name: 'Email',
      description: 'Connect email to receive leads and inquiries',
      icon: Mail,
      enabled: false,
      emailAddress: '',
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Schedule meetings directly from chat',
      icon: Calendar,
      enabled: false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Connect WhatsApp for messaging',
      icon: MessageCircle,
      enabled: false,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Connect Instagram for DM integration',
      icon: Instagram,
      enabled: false,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const enabledCount = integrations.filter(i => i.enabled).length;
  const totalCount = integrations.length;
  const remainingCount = totalCount - enabledCount;

  const handleToggle = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const handleEmailChange = (id: string, value: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, emailAddress: value }
          : integration
      )
    );
  };

  const handleSave = async () => {
    if (!genieId) {
      toast.error('No Genie ID found');
      return;
    }

    // Validate email integration
    const mailIntegration = integrations.find(i => i.id === 'mail');
    if (mailIntegration?.enabled) {
      if (!mailIntegration.emailAddress) {
        toast.error('Please enter an email prefix for the Mail integration');
        return;
      }
      if (!/^[a-z0-9_-]+$/i.test(mailIntegration.emailAddress)) {
        toast.error('Email prefix can only contain letters, numbers, hyphens, and underscores');
        return;
      }
    }

    setIsSaving(true);
    
    try {
      // TODO: Add API call to save integrations
      // const response = await api.updateIntegrations(genieId, integrations);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast.success('Integrations saved successfully');
    } catch (error) {
      console.error('Failed to save integrations:', error);
      toast.error('Failed to save integrations');
    } finally {
      setIsSaving(false);
    }
  };

  if (!genieId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No Genie ID found. Please select a genie from the dashboard first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Plug2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-sm text-gray-600">Connect external services to enhance your Genie</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {remainingCount} remaining
        </Badge>
      </div>

      {/* Integrations List */}
      <div className="grid gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration.enabled ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        integration.enabled ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {integration.name}
                        {integration.enabled && (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggle(integration.id)}
                  />
                </div>
              </CardHeader>

              {/* Email Configuration */}
              {integration.id === 'mail' && integration.enabled && (
                <CardContent className="pt-0">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Label htmlFor="email-prefix" className="text-sm font-medium text-gray-900 mb-2 block">
                      Email Address
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email-prefix"
                        type="text"
                        placeholder="your-email"
                        value={integration.emailAddress || ''}
                        onChange={(e) => handleEmailChange(integration.id, e.target.value)}
                        className="flex-1 bg-white"
                      />
                      <span className="text-sm text-gray-600 whitespace-nowrap">@aladdyn.io</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Only letters, numbers, hyphens, and underscores are allowed
                    </p>
                    {integration.emailAddress && (
                      <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                        <p className="text-xs text-gray-600 mb-1">Your email address will be:</p>
                        <p className="text-sm font-medium text-blue-900">
                          {integration.emailAddress}@aladdyn.io
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save Integrations'}
        </Button>
      </div>
    </div>
  );
}

