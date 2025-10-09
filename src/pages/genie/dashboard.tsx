import { Card, CardContent } from '@/ui/components/Card';
import { StatCard } from '@/components/StatCard';
import { VisitorsChart } from '@/components/VisitorsChart';
import { DashboardTable } from '@/ui/components/table/DashboardTable';
import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export function GenieDashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$1,250.00',
      change: '12.5%',
      changeType: 'positive' as const,
      description: 'Trending up this month',
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
    },
    {
      title: 'New Customers',
      value: '1,234',
      change: '20%',
      changeType: 'negative' as const,
      description: 'Acquisition needs attention',
      icon: <UserGroupIcon className="h-5 w-5" />,
    },
    {
      title: 'Active Accounts',
      value: '45,678',
      change: '12.5%',
      changeType: 'positive' as const,
      description: 'Engagement exceed targets',
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      title: 'Growth Rate',
      value: '4.5%',
      change: '4.5%',
      changeType: 'positive' as const,
      description: 'Steady performance increase',
      icon: <ChartBarIcon className="h-5 w-5" />,
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
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Visitors Chart */}
      <VisitorsChart />

      {/* Dashboard Table */}
      <DashboardTable />

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
