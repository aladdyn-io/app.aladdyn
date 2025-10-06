import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/Card';
import { Button } from '@/ui/components/Button';
import { Badge } from '@/ui/components/Badge';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

export function Settings() {
  const settings = [
    {
      category: 'General',
      icon: Cog6ToothIcon,
      items: [
        { name: 'Application Name', value: 'Web App V2', type: 'text' },
        { name: 'Default Language', value: 'English', type: 'select' },
        { name: 'Time Zone', value: 'UTC-8 (Pacific)', type: 'select' },
      ]
    },
    {
      category: 'Notifications',
      icon: BellIcon,
      items: [
        { name: 'Email Notifications', value: 'Enabled', type: 'toggle' },
        { name: 'Push Notifications', value: 'Disabled', type: 'toggle' },
        { name: 'SMS Notifications', value: 'Disabled', type: 'toggle' },
      ]
    },
    {
      category: 'Security',
      icon: ShieldCheckIcon,
      items: [
        { name: 'Two-Factor Authentication', value: 'Enabled', type: 'toggle' },
        { name: 'Session Timeout', value: '30 minutes', type: 'select' },
        { name: 'Password Policy', value: 'Strong', type: 'select' },
      ]
    },
    {
      category: 'Appearance',
      icon: PaintBrushIcon,
      items: [
        { name: 'Theme', value: 'Light', type: 'select' },
        { name: 'Accent Color', value: 'Blue', type: 'select' },
        { name: 'Font Size', value: 'Medium', type: 'select' },
      ]
    },
    {
      category: 'Privacy',
      icon: GlobeAltIcon,
      items: [
        { name: 'Analytics Tracking', value: 'Enabled', type: 'toggle' },
        { name: 'Error Reporting', value: 'Enabled', type: 'toggle' },
        { name: 'Usage Statistics', value: 'Anonymous', type: 'select' },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your application preferences and system settings
        </p>
      </div>

      {/* Settings categories */}
      <div className="space-y-6">
        {settings.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <category.icon className="h-6 w-6 text-gray-600" />
                <CardTitle>{category.category}</CardTitle>
              </div>
              <CardDescription>
                Configure {category.category.toLowerCase()} settings for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Current value: {item.value}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {item.type === 'toggle' ? (
                        <Badge variant={item.value === 'Enabled' ? 'success' : 'default'}>
                          {item.value}
                        </Badge>
                      ) : (
                        <Badge variant="info">{item.value}</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and version information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Version</p>
              <p className="text-lg font-semibold text-gray-900">v2.1.0</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Build</p>
              <p className="text-lg font-semibold text-gray-900">2024.01.15</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant="success" className="mt-1">Online</Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Uptime</p>
              <p className="text-lg font-semibold text-gray-900">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
