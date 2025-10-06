import { Card, CardContent } from '@/ui/components/Card';
import { 
  ChartBarIcon, 
  PlayIcon,
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export function GenieDashboard() {
  const stats = [
    {
      name: 'Active Genies',
      value: '12',
      change: '+2',
      changeType: 'increase' as const,
      icon: SparklesIcon,
    },
    {
      name: 'Leads Generated',
      value: '1,247',
      change: '+15%',
      changeType: 'increase' as const,
      icon: UserGroupIcon,
    },
    {
      name: 'Training Sessions',
      value: '89',
      change: '+12%',
      changeType: 'increase' as const,
      icon: AcademicCapIcon,
    },
    {
      name: 'Playground Runs',
      value: '456',
      change: '+8%',
      changeType: 'increase' as const,
      icon: PlayIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Genie Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your AI-powered Genie workspace. Monitor performance and manage your intelligent agents.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-emerald-400" />
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
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-emerald-600">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <PlayIcon className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Launch Playground</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Train New Genie</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">View Lead Analytics</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">Genie "LeadBot" generated 23 new leads</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Training session completed for "SupportBot"</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Playground experiment "EmailBot" ready</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
