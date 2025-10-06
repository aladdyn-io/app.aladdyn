import { Card, CardContent } from '@/ui/components/Card';
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
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Aladdyn! Here's what's happening with your AI-powered tools today.
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

    </div>
  );
}
