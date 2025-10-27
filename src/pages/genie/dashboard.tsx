
import { Card, CardContent } from '@/ui/components/Card';
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { umamiService } from '@/services/umami'
import type { UmamiStats } from '@/services/umami'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import api from '@/services/api'


export function GenieDashboard() {
  const { genieId } = useParams<{ genieId?: string }>();
  const [stats, setStats] = useState<UmamiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setGenieName] = useState<string>('');

  useEffect(() => {
    if (genieId) {
      fetchGenieDetails();
      fetchDashboardStats();
    }
  }, [genieId]);

  const fetchGenieDetails = async () => {
    if (!genieId) return;

    try {
      const response = await api.getGenieDetails(genieId);
      if (response.success && response.data) {
        setGenieName((response.data as any).name);
      }
    } catch (error) {
      console.error('Failed to fetch genie details:', error);
    }
  };

  const fetchDashboardStats = async () => {
    if (!genieId) return;

    setLoading(true);
    try {
      const data = await umamiService.getStatsForRange(genieId, '7d');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    toast.success('Welcome to your Genie Dashboard!', {
      description: 'Monitor your AI agent\'s performance and interactions.'
    })
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <>
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

    <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
      
      {/* Real Analytics Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : stats ? (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
          <Card className="@container/card" data-slot="card">
            <CardHeader className="relative">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {formatNumber(stats.stats.pageviews.value)}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {calculateChange(stats.stats.pageviews.value, stats.stats.pageviews.prev) >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {calculateChange(stats.stats.pageviews.value, stats.stats.pageviews.prev) >= 0 ? '+' : ''}
                  {calculateChange(stats.stats.pageviews.value, stats.stats.pageviews.prev).toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {calculateChange(stats.stats.pageviews.value, stats.stats.pageviews.prev) >= 0 ? 'Trending up' : 'Trending down'} this week
                {calculateChange(stats.stats.pageviews.value, stats.stats.pageviews.prev) >= 0 ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                Pageviews for the last 7 days
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card" data-slot="card">
            <CardHeader className="relative">
              <CardDescription>Unique Visitors</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {formatNumber(stats.stats.visitors.value)}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {calculateChange(stats.stats.visitors.value, stats.stats.visitors.prev) >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {calculateChange(stats.stats.visitors.value, stats.stats.visitors.prev) >= 0 ? '+' : ''}
                  {calculateChange(stats.stats.visitors.value, stats.stats.visitors.prev).toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {calculateChange(stats.stats.visitors.value, stats.stats.visitors.prev) >= 0 ? 'Strong growth' : 'Needs attention'}
                {calculateChange(stats.stats.visitors.value, stats.stats.visitors.prev) >= 0 ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">User acquisition metrics</div>
            </CardFooter>
          </Card>

          <Card className="@container/card" data-slot="card">
            <CardHeader className="relative">
              <CardDescription>Total Visits</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {formatNumber(stats.stats.visits.value)}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {calculateChange(stats.stats.visits.value, stats.stats.visits.prev) >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {calculateChange(stats.stats.visits.value, stats.stats.visits.prev) >= 0 ? '+' : ''}
                  {calculateChange(stats.stats.visits.value, stats.stats.visits.prev).toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Strong engagement
                <TrendingUpIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">Session performance</div>
            </CardFooter>
          </Card>

          <Card className="@container/card" data-slot="card">
            <CardHeader className="relative">
              <CardDescription>Bounce Rate</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {stats.stats.visits.value > 0 
                  ? Math.round((stats.stats.bounces.value / stats.stats.visits.value) * 100)
                  : 0}%
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {calculateChange(
                    (stats.stats.bounces.value / stats.stats.visits.value) * 100,
                    (stats.stats.bounces.prev / stats.stats.visits.prev) * 100
                  ) <= 0 ? (
                    <TrendingDownIcon className="size-3" />
                  ) : (
                    <TrendingUpIcon className="size-3" />
                  )}
                  {calculateChange(
                    (stats.stats.bounces.value / stats.stats.visits.value) * 100,
                    (stats.stats.bounces.prev / stats.stats.visits.prev) * 100
                  ) <= 0 ? '' : '+'}
                  {Math.abs(calculateChange(
                    (stats.stats.bounces.value / stats.stats.visits.value) * 100,
                    (stats.stats.bounces.prev / stats.stats.visits.prev) * 100
                  )).toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {calculateChange(
                  (stats.stats.bounces.value / stats.stats.visits.value) * 100,
                  (stats.stats.bounces.prev / stats.stats.visits.prev) * 100
                ) <= 0 ? 'Improving engagement' : 'Needs optimization'}
              </div>
              <div className="text-muted-foreground">User retention metric</div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="px-4 lg:px-6">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      )}

      <div className="px-4 lg:px-6">
        {stats && stats.timeseries && stats.timeseries.sessions.length > 0 ? (
          <Card className="@container/card">
            <CardHeader className="relative">
              <CardTitle>Total Visitors & Views</CardTitle>
              <CardDescription>
                <span className="@[540px]/card:block hidden">
                  Activity for the last 7 days
                </span>
                <span className="@[540px]/card:hidden">Last 7 days</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <div className="h-[250px] w-full">
                <div className="text-sm text-gray-500 mb-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                    <span>Visitors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span>Views</span>
                  </div>
                </div>
                <div className="h-full w-full flex items-end justify-between gap-1 border-l border-b border-gray-200 pl-4 pb-4">
                  {stats.timeseries.sessions.map((session, index) => {
                    const maxValue = Math.max(
                      ...stats.timeseries.sessions.map(s => s.y),
                      ...stats.timeseries.pageviews.map(p => p.y)
                    );
                    const sessionHeight = maxValue > 0 ? (session.y / maxValue) * 100 : 0;
                    const pageviewHeight = maxValue > 0 && stats.timeseries.pageviews[index] 
                      ? (stats.timeseries.pageviews[index].y / maxValue) * 100 
                      : 0;

                    return (
                      <div key={index} className="flex-1 flex items-end justify-center gap-0.5 group">
                        <div 
                          className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all rounded-t relative"
                          style={{ height: `${sessionHeight}%` }}
                          title={`${session.y} visitors`}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded">
                            {session.y} visitors
                          </div>
                        </div>
                        {stats.timeseries.pageviews[index] && (
                          <div 
                            className="w-full bg-blue-400 hover:bg-blue-500 transition-all rounded-t"
                            style={{ height: `${pageviewHeight}%` }}
                            title={`${stats.timeseries.pageviews[index].y} views`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
        <ChartAreaInteractive />
        )}
      </div>
      {/* <DataTable data={data} /> */}
      </div>
      </div>

    </>
  )
}
