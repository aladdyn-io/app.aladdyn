import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/Card';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  BellIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const stats = [
    {
      name: 'Total Users',
      value: '12,345',
      change: '+12%',
      changeType: 'increase' as const,
      icon: UsersIcon,
    },
    {
      name: 'Documents',
      value: '1,234',
      change: '+8%',
      changeType: 'increase' as const,
      icon: DocumentTextIcon,
    },
    {
      name: 'Analytics',
      value: '98.5%',
      change: '-2%',
      changeType: 'decrease' as const,
      icon: ChartBarIcon,
    },
    {
      name: 'Notifications',
      value: '23',
      change: '+5',
      changeType: 'increase' as const,
      icon: BellIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your app today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and changes in your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'User login', time: '2 minutes ago', status: 'success' },
                { action: 'Document uploaded', time: '5 minutes ago', status: 'info' },
                { action: 'Settings updated', time: '1 hour ago', status: 'warning' },
                { action: 'New user registered', time: '2 hours ago', status: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant={activity.status as any}>
                      {activity.status}
                    </Badge>
                    <span className="text-sm text-gray-900">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Create Document
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <UsersIcon className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
