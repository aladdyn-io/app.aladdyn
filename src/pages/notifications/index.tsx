import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function Notifications() {
  const notifications = [
    {
      id: 1,
      title: 'New user registered',
      message: 'John Doe has joined your application',
      time: '2 minutes ago',
      unread: true,
      type: 'success'
    },
    {
      id: 2,
      title: 'System maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM',
      time: '1 hour ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Document uploaded',
      message: 'New document has been uploaded to the system',
      time: '3 hours ago',
      unread: false,
      type: 'info'
    },
    {
      id: 4,
      title: 'Profile updated',
      message: 'Your profile information has been updated',
      time: '1 day ago',
      unread: false,
      type: 'success'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated with the latest activity
          </p>
        </div>
        <Button variant="outline">
          Mark all as read
        </Button>
      </div>

      {/* Notification stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BellIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Notifications</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Read</p>
                <p className="text-2xl font-semibold text-gray-900">21</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications list */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg transition-colors ${
                  notification.unread 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      notification.unread ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <Badge variant={notification.type as any} size="sm">
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notification.unread && (
                      <Button variant="ghost" size="sm">
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
