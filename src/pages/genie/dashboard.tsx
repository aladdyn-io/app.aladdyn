import { Card, CardContent } from '@/ui/components/Card';
import { 
  PlayIcon,
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Checklist</h3>
            <div className="space-y-4">
              {/* Analytics - Completed */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-500 line-through">Analytics Connected</span>
              </div>
              
              {/* Calendly - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect Calendly</span>
                </button>
              </div>
              
              {/* YouMail - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect YouMail</span>
                </button>
              </div>
              
              {/* Instagram - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect Instagram Account</span>
                </button>
              </div>
              
              {/* WhatsApp - Pending */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="text-left hover:text-emerald-600 transition-colors">
                  <span className="font-medium">Connect WhatsApp Account</span>
                </button>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-emerald-600">1/5 Complete</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{width: '20%'}}></div>
              </div>
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
