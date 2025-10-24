import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { umamiService } from '@/services/umami';
import type { UmamiStats, UmamiEventsResponse, UmamiSessionsResponse } from '@/services/umami';
import { Activity, Users, Eye, TrendingUp, Globe, Monitor, Smartphone, RefreshCw, Chrome, Apple, TabletSmartphone } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

export function GenieAnalytics() {
  const [stats, setStats] = useState<UmamiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [genieId, setGenieId] = useState<string | null>(null);
  const [eventsData, setEventsData] = useState<UmamiEventsResponse | null>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionsData, setSessionsData] = useState<UmamiSessionsResponse | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionSearchTerm, setSessionSearchTerm] = useState('');

  // Get genieId from localStorage
  useEffect(() => {
    const storedGenieId = localStorage.getItem('currentGenieId');
    if (storedGenieId) {
      setGenieId(storedGenieId);
    } else {
      toast.error('No genie ID found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = async () => {
    if (!genieId) {
      return;
    }

    setLoading(true);
    try {
      const data = await umamiService.getStatsForRange(genieId, timeRange);
      console.log('📊 Analytics data received:', data);
      console.log('📈 Timeseries data:', data.timeseries);
      setStats(data);
      toast.success('Analytics loaded successfully');
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genieId) {
      fetchAnalytics();
      fetchEvents();
      fetchSessions();
    }
  }, [timeRange, genieId]);

  const fetchEvents = async () => {
    if (!genieId) return;

    setEventsLoading(true);
    try {
      const data = await umamiService.getEventsForRange(genieId, timeRange);
      console.log('📋 Events data received:', data);
      setEventsData(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchSessions = async () => {
    if (!genieId) return;

    setSessionsLoading(true);
    try {
      const data = await umamiService.getSessionsForRange(genieId, timeRange);
      console.log('👥 Sessions data received:', data);
      setSessionsData(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getBrowserIcon = (browserName: string) => {
    const name = browserName.toLowerCase();
    if (name.includes('chrome')) return <Chrome className="w-4 h-4 text-gray-400" />;
    if (name.includes('safari')) return <Apple className="w-4 h-4 text-gray-400" />;
    if (name.includes('firefox')) return <Monitor className="w-4 h-4 text-gray-400" />;
    if (name.includes('edge')) return <Monitor className="w-4 h-4 text-gray-400" />;
    return <Monitor className="w-4 h-4 text-gray-400" />;
  };

  const getOSIcon = (osName: string) => {
    const name = osName.toLowerCase();
    if (name.includes('mac') || name.includes('ios')) return <Apple className="w-4 h-4 text-gray-400" />;
    if (name.includes('windows')) return <Monitor className="w-4 h-4 text-gray-400" />;
    if (name.includes('android')) return <Smartphone className="w-4 h-4 text-gray-400" />;
    if (name.includes('linux')) return <Monitor className="w-4 h-4 text-gray-400" />;
    return <Monitor className="w-4 h-4 text-gray-400" />;
  };

  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName.toLowerCase();
    if (name.includes('mobile') || name.includes('phone')) return <Smartphone className="w-4 h-4 text-gray-400" />;
    if (name.includes('tablet')) return <TabletSmartphone className="w-4 h-4 text-gray-400" />;
    if (name.includes('desktop') || name.includes('laptop')) return <Monitor className="w-4 h-4 text-gray-400" />;
    return <Monitor className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive analytics powered by Umami for your Genie performance metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
variant={timeRange === range ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`text-xs ${
                  timeRange === range 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'hover:bg-gray-200'
                }`}
              >
                {range === '24h' ? '24H' : range === '7d' ? '7D' : range === '30d' ? '30D' : '90D'}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm text-gray-500">Loading analytics...</p>
          </div>
        </div>
      ) : stats ? (
        <>
          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Metrics Bar - Umami Style (Top KPIs) */}
              {stats && stats.stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg mb-6">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.stats.pageviews.value)}</div>
                    {stats.stats.pageviews.prev > 0 && (
                      <div className={`text-xs flex items-center gap-1 ${
                        (stats.stats.pageviews.value - stats.stats.pageviews.prev) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(stats.stats.pageviews.value - stats.stats.pageviews.prev) >= 0 ? '↑' : '↓'}
                        {' '}{Math.abs(calculateChange(stats.stats.pageviews.value, stats.stats.pageviews.prev)).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visits</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.stats.visits.value)}</div>
                    {stats.stats.visits.prev > 0 && (
                      <div className={`text-xs flex items-center gap-1 ${
                        (stats.stats.visits.value - stats.stats.visits.prev) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(stats.stats.visits.value - stats.stats.visits.prev) >= 0 ? '↑' : '↓'}
                        {' '}{Math.abs(calculateChange(stats.stats.visits.value, stats.stats.visits.prev)).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visitors</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.stats.visitors.value)}</div>
                    {stats.stats.visitors.prev > 0 && (
                      <div className={`text-xs flex items-center gap-1 ${
                        (stats.stats.visitors.value - stats.stats.visitors.prev) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(stats.stats.visitors.value - stats.stats.visitors.prev) >= 0 ? '↑' : '↓'}
                        {' '}{Math.abs(calculateChange(stats.stats.visitors.value, stats.stats.visitors.prev)).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bounce rate</div>
                    <div className="text-3xl font-semibold tabular-nums">
                      {stats.stats.visits.value > 0 
                        ? Math.round((stats.stats.bounces.value / stats.stats.visits.value) * 100)
                        : 0}%
                    </div>
                    {stats.stats.visits.prev > 0 && (
                      <div className={`text-xs flex items-center gap-1 ${
                        calculateChange(
                          (stats.stats.bounces.value / stats.stats.visits.value) * 100,
                          (stats.stats.bounces.prev / stats.stats.visits.prev) * 100
                        ) <= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {calculateChange(
                          (stats.stats.bounces.value / stats.stats.visits.value) * 100,
                          (stats.stats.bounces.prev / stats.stats.visits.prev) * 100
                        ) <= 0 ? '↓' : '↑'}
                        {' '}{Math.abs(calculateChange(
                          (stats.stats.bounces.value / stats.stats.visits.value) * 100,
                          (stats.stats.bounces.prev / stats.stats.visits.prev) * 100
                        )).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visit duration</div>
                    <div className="text-3xl font-semibold tabular-nums">
                      {stats.stats.visits.value > 0 
                        ? formatDuration(Math.floor(stats.stats.totaltime.value / stats.stats.visits.value / 1000))
                        : '0s'}
                    </div>
                    {stats.stats.visits.prev > 0 && (
                      <div className={`text-xs flex items-center gap-1 ${
                        (stats.stats.totaltime.value / stats.stats.visits.value - stats.stats.totaltime.prev / stats.stats.visits.prev) >= 0 
                        ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(stats.stats.totaltime.value / stats.stats.visits.value - stats.stats.totaltime.prev / stats.stats.visits.prev) >= 0 ? '↑' : '↓'}
                        {' '}{Math.abs(calculateChange(
                          stats.stats.totaltime.value / stats.stats.visits.value,
                          stats.stats.totaltime.prev / stats.stats.visits.prev
                        )).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Chart - Recharts Area Chart */}
              {stats.timeseries && stats.timeseries.sessions && stats.timeseries.sessions.length > 0 && (
                <Card className="@container/card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">Activity Over Time</CardTitle>
                      <CardDescription className="text-xs text-gray-500 mt-1">
                        Visitors and pageviews for the selected period
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                        <span className="text-gray-600">Visitors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded"></div>
                        <span className="text-gray-600">Views</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                      config={{
                        visitors: {
                          label: "Visitors",
                          color: "hsl(142, 76%, 36%)",
                        },
                        views: {
                          label: "Views",
                          color: "hsl(221, 83%, 53%)",
                        },
                      } satisfies ChartConfig}
                      className="aspect-auto h-[250px] w-full"
                    >
                      <AreaChart 
                        data={stats.timeseries.sessions
                          .map((session, index) => {
                            // Ensure proper date formatting
                            let dateValue: string;
                            try {
                              if (typeof session.t === 'string') {
                                // Already a string, validate it's a valid date
                                const testDate = new Date(session.t);
                                if (isNaN(testDate.getTime())) {
                                  console.warn('Invalid date string:', session.t);
                                  return null;
                                }
                                dateValue = session.t;
                              } else if (typeof session.t === 'number') {
                                // It's a timestamp
                                dateValue = new Date(session.t).toISOString();
                              } else {
                                // Try to convert to date
                                const date = new Date(session.t);
                                if (isNaN(date.getTime())) {
                                  console.warn('Invalid date value:', session.t);
                                  return null;
                                }
                                dateValue = date.toISOString();
                              }
                              
                              return {
                                date: dateValue,
                                visitors: session.y || 0,
                                views: stats.timeseries.pageviews[index]?.y || 0
                              };
                            } catch (error) {
                              console.error('Error processing date:', session.t, error);
                              return null;
                            }
                          })
                          .filter((item): item is NonNullable<typeof item> => item !== null)
                        }
                      >
                        <defs>
                          <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="hsl(142, 76%, 36%)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(142, 76%, 36%)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="hsl(221, 83%, 53%)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(221, 83%, 53%)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={32}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            if (timeRange === '24h') {
                              return date.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                hour12: true,
                              });
                            }
                            return date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            });
                          }}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value: any) => {
                                const date = new Date(value);
                                if (timeRange === '24h') {
                                  return date.toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  });
                                }
                                return date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                });
                              }}
                              indicator="dot"
                            />
                          }
                        />
                        <Area
                          dataKey="views"
                          type="natural"
                          fill="url(#fillViews)"
                          stroke="hsl(221, 83%, 53%)"
                          strokeWidth={2}
                          stackId="a"
                        />
                        <Area
                          dataKey="visitors"
                          type="natural"
                          fill="url(#fillVisitors)"
                          stroke="hsl(142, 76%, 36%)"
                          strokeWidth={2}
                          stackId="a"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              {/* Row 1: Pages | Referrers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">Pages</CardTitle>
                    <button className="text-xs text-blue-600 hover:underline">More →</button>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.urls.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topMetrics.urls.slice(0, 10).map((url, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="truncate flex-1 text-sm text-gray-700">{url.x}</span>
                            <div className="flex items-center gap-3 ml-4">
                              <span className="font-medium text-sm">{formatNumber(url.y)}</span>
                              <span className="text-xs text-gray-500 min-w-[45px] text-right">
                                {stats.stats.pageviews.value > 0 
                                  ? Math.round((url.y / stats.stats.pageviews.value) * 100) 
                                  : 0}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">Referrers</CardTitle>
                    <button className="text-xs text-blue-600 hover:underline">More →</button>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.referrers.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topMetrics.referrers.slice(0, 10).map((referrer, index) => {
                          // Extract domain from referrer URL
                          const getDomain = (url: string) => {
                            try {
                              // If it's already a domain (no protocol), return as is
                              if (!url.includes('://')) {
                                return url;
                              }
                              const urlObj = new URL(url);
                              return urlObj.hostname;
                            } catch {
                              return url;
                            }
                          };

                          const domain = getDomain(referrer.x);
                          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

                          return (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2 truncate flex-1">
                                <img 
                                  src={faviconUrl} 
                                  alt="" 
                                  className="w-4 h-4 flex-shrink-0"
                                  onError={(e) => {
                                    // Fallback to globe icon if favicon fails
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <span className="truncate text-sm text-gray-700">{referrer.x}</span>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <span className="font-medium text-sm">{formatNumber(referrer.y)}</span>
                                <span className="text-xs text-gray-500 min-w-[45px] text-right">
                                  {stats.stats.visits.value > 0 
                                    ? Math.round((referrer.y / stats.stats.visits.value) * 100) 
                                    : 0}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Row 2: Browsers | OS | Devices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">Browsers</CardTitle>
                    <button className="text-xs text-blue-600 hover:underline">More →</button>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.browsers.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topMetrics.browsers.slice(0, 10).map((browser, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 flex items-center gap-2">
                              {getBrowserIcon(browser.x)}
                              {browser.x}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm">{formatNumber(browser.y)}</span>
                              <span className="text-xs text-gray-500 min-w-[45px] text-right">
                                {stats.stats.visitors.value > 0 
                                  ? Math.round((browser.y / stats.stats.visitors.value) * 100) 
                                  : 0}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">OS</CardTitle>
                    <button className="text-xs text-blue-600 hover:underline">More →</button>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.os.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topMetrics.os.slice(0, 10).map((os, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 flex items-center gap-2">
                              {getOSIcon(os.x)}
                              {os.x}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm">{formatNumber(os.y)}</span>
                              <span className="text-xs text-gray-500 min-w-[45px] text-right">
                                {stats.stats.visitors.value > 0 
                                  ? Math.round((os.y / stats.stats.visitors.value) * 100) 
                                  : 0}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">Devices</CardTitle>
                    <button className="text-xs text-blue-600 hover:underline">More →</button>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.devices.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topMetrics.devices.slice(0, 10).map((device, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 flex items-center gap-2">
                              {getDeviceIcon(device.x)}
                              {device.x}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm">{formatNumber(device.y)}</span>
                              <span className="text-xs text-gray-500 min-w-[45px] text-right">
                                {stats.stats.visitors.value > 0 
                                  ? Math.round((device.y / stats.stats.visitors.value) * 100) 
                                  : 0}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Row 3: Countries (with world map in Umami - we'll use a full width table) */}
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Countries
                    </CardTitle>
                    <button className="text-xs text-blue-600 hover:underline">More →</button>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.countries.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stats.topMetrics.countries.slice(0, 12).map((country, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                            <span className="text-sm text-gray-700 flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              {country.x}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm">{formatNumber(country.y)}</span>
                              <span className="text-xs text-gray-500 min-w-[45px] text-right">
                                {stats.stats.visitors.value > 0 
                                  ? Math.round((country.y / stats.stats.visitors.value) * 100) 
                                  : 0}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6 mt-6">
              {/* Events Metrics Bar */}
              {stats && stats.sessionStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visitors</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.visitors.value)}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visits</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.visits.value)}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.pageviews.value)}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.events.value)}</div>
                  </div>
                </div>
              )}

              {/* Events Chart and Table Row */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                {/* Events Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Events Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border border-dashed rounded">
                      <p className="text-sm text-gray-400">No event data to display</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Events Summary Table */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">Events</CardTitle>
                    <span className="text-xs text-gray-500">Actions</span>
                  </CardHeader>
                  <CardContent>
                    {stats.eventData && stats.eventData.events > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Total events: {formatNumber(stats.eventData.events)}</p>
                        <p className="text-sm text-gray-600">Properties: {formatNumber(stats.eventData.properties)}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Activity and Properties Tabs */}
              <div className="space-y-4">
                <Tabs defaultValue="activity" className="w-full">
                  <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0">
                    <TabsTrigger 
                      value="activity" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Activity
                    </TabsTrigger>
                    <TabsTrigger 
                      value="properties"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Properties
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="activity" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        {/* Search Bar */}
                        <div className="mb-4">
                          <div className="relative">
                            <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Activity Table */}
                        {eventsLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                          </div>
                        ) : eventsData && eventsData.data.length > 0 ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-[100px_1fr_220px] gap-4 text-xs font-medium text-gray-600 pb-2 border-b">
                              <div>Session</div>
                              <div>Event</div>
                              <div>Created</div>
                            </div>

                            {/* Activity Rows */}
                            <div className="space-y-3">
                              {eventsData.data
                                .filter(event => {
                                  if (!searchTerm) return true;
                                  const search = searchTerm.toLowerCase();
                                  return (
                                    event.urlPath?.toLowerCase().includes(search) ||
                                    event.pageTitle?.toLowerCase().includes(search) ||
                                    event.eventName?.toLowerCase().includes(search)
                                  );
                                })
                                .map((event) => {
                                  // Generate consistent avatar based on sessionId
                                  const avatarSeed = parseInt(event.sessionId.substring(0, 8), 16);
                                  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

                                  return (
                                    <div key={event.id} className="grid grid-cols-[100px_1fr_220px] gap-4 items-center py-2 hover:bg-gray-50 rounded">
                                      {/* Session Avatar */}
                                      <div className="flex items-center justify-center">
                                        <img 
                                          src={avatarUrl} 
                                          alt="Session" 
                                          className="w-12 h-12 rounded-full"
                                        />
                                      </div>

                                      {/* Event Details */}
                                      <div className="flex items-center gap-2 text-sm">
                                        <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span className="text-gray-600">
                                          {event.eventName ? 'Triggered event' : 'Viewed page'}
                                        </span>
                                        <span className="font-medium text-gray-900">
                                          {event.eventName || event.urlPath}
                                        </span>
                                      </div>

                                      {/* Created Time */}
                                      <div className="text-sm text-gray-600">
                                        {new Date(event.createdAt).toLocaleString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          second: '2-digit',
                                          hour12: true
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>

                            {/* Pagination Info */}
                            {eventsData.count > eventsData.pageSize && (
                              <div className="text-xs text-gray-500 text-center pt-4">
                                Showing {eventsData.data.length} of {eventsData.count} events
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Activity className="w-12 h-12 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No events found</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="properties" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-500 py-8 text-center">No event properties available</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6 mt-6">
              {/* Sessions Metrics Bar */}
              {stats && stats.sessionStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visitors</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.visitors.value)}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visits</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.visits.value)}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.pageviews.value)}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                    <div className="text-3xl font-semibold tabular-nums">{formatNumber(stats.sessionStats.countries.value)}</div>
                  </div>
                </div>
              )}

              {/* World Map and Activity Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                {/* World Map */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-blue-50/30 rounded-lg border border-blue-100 relative">
                      {/* Simple SVG world map outline */}
                      <svg viewBox="0 0 800 400" className="w-full h-full">
                        {/* World map simplified outline */}
                        <rect width="800" height="400" fill="#f0f9ff" />
                        
                        {/* India highlighted (approximate coordinates) */}
                        {stats.topMetrics.countries.some(c => c.x === 'IN' || c.x === 'India') && (
                          <g>
                            <path
                              d="M520,180 L525,185 L530,195 L528,205 L522,215 L518,218 L510,220 L505,218 L502,210 L498,200 L500,190 L505,185 L510,182 L520,180 Z"
                              fill="#3b82f6"
                              stroke="#2563eb"
                              strokeWidth="1"
                            />
                          </g>
                        )}
                        
                        {/* World outline */}
                        <path
                          d="M50,100 Q100,80 150,100 T250,120 T350,110 T450,130 T550,115 T650,125 T750,110 
                             M50,200 Q100,180 150,200 T250,220 T350,210 T450,230 T550,215 T650,225 T750,210
                             M50,300 Q100,280 150,300 T250,320 T350,310 T450,330 T550,315 T650,325 T750,310"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          fill="none"
                        />
                      </svg>
                      
                      {/* Country labels overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            {stats.topMetrics.countries.slice(0, 5).map((country, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">{country.x}</span>
                                <span className="text-sm text-gray-500">({formatNumber(country.y)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Heatmap */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Activity Heatmap</CardTitle>
                    <CardDescription className="text-xs">Sessions by day & hour</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Day labels */}
                      <div className="grid grid-cols-8 gap-1 text-[10px] text-gray-500">
                        <div></div>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center">{day}</div>
                        ))}
                      </div>
                      
                      {/* Heatmap data */}
                      {sessionsData && sessionsData.data.length > 0 ? (
                        <div className="space-y-1">
                          {sessionsData.data.slice(0, 5).map((session) => {
                            const date = new Date(session.createdAt);
                            const day = date.getDay();
                            const hour = date.getHours();
                            
                            return (
                              <div key={session.id} className="flex items-center gap-2 text-xs">
                                <span className="w-12 text-gray-500">{hour}:00</span>
                                <div className="flex gap-1">
                                  {[0,1,2,3,4,5,6].map(d => (
                                    <div 
                                      key={d} 
                                      className={`w-5 h-5 rounded ${
                                        d === day 
                                          ? 'bg-blue-500' 
                                          : 'bg-gray-100'
                                      }`}
                                      title={d === day ? `${session.views} views` : ''}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 py-8 text-center">No session data</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sessions Table */}
              <Card>
                <CardContent className="pt-6">
                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search sessions"
                        value={sessionSearchTerm}
                        onChange={(e) => setSessionSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Sessions Table */}
                  {sessionsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : sessionsData && sessionsData.data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="text-xs font-medium text-gray-600 border-b">
                          <tr>
                            <th className="text-left pb-2 pr-4">Session</th>
                            <th className="text-left pb-2 pr-4">Browser</th>
                            <th className="text-left pb-2 pr-4">OS</th>
                            <th className="text-left pb-2 pr-4">Device</th>
                            <th className="text-left pb-2 pr-4">Location</th>
                            <th className="text-left pb-2 pr-4">Views</th>
                            <th className="text-left pb-2">Created</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {sessionsData.data
                            .filter(session => {
                              if (!sessionSearchTerm) return true;
                              const search = sessionSearchTerm.toLowerCase();
                              return (
                                session.browser?.toLowerCase().includes(search) ||
                                session.os?.toLowerCase().includes(search) ||
                                session.country?.toLowerCase().includes(search) ||
                                session.city?.toLowerCase().includes(search)
                              );
                            })
                            .map((session) => {
                              const avatarSeed = parseInt(session.id.substring(0, 8), 16);
                              const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

                              return (
                                <tr key={session.id} className="border-b hover:bg-gray-50">
                                  <td className="py-3 pr-4">
                                    <img src={avatarUrl} alt="Session" className="w-10 h-10 rounded-full" />
                                  </td>
                                  <td className="py-3 pr-4">
                                    <div className="flex items-center gap-2">
                                      {getBrowserIcon(session.browser)}
                                      <span>{session.browser}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 pr-4">
                                    <div className="flex items-center gap-2">
                                      {getOSIcon(session.os)}
                                      <span>{session.os}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 pr-4">
                                    <div className="flex items-center gap-2">
                                      {getDeviceIcon(session.device)}
                                      <span>{session.device}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 pr-4">
                                    <div className="flex items-center gap-1">
                                      <Globe className="w-3 h-3 text-gray-400" />
                                      <span>{session.city}, {session.country}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 pr-4 font-medium">{session.views}</td>
                                  <td className="py-3">
                                    {new Date(session.createdAt).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>

                      {/* Pagination Info */}
                      {sessionsData.count > sessionsData.pageSize && (
                        <div className="text-xs text-gray-500 text-center pt-4 mt-4 border-t">
                          Showing {sessionsData.data.length} of {sessionsData.count} sessions
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No sessions found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6 mt-6">
              {/* Reports Summary */}
              {stats && stats.stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Total Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatNumber(stats.stats.pageviews.value)}</div>
                      {stats.stats.pageviews.prev > 0 && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${
                          (stats.stats.pageviews.value - stats.stats.pageviews.prev) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(stats.stats.pageviews.value - stats.stats.pageviews.prev) >= 0 ? '↑' : '↓'}
                          {Math.abs(calculateChange(stats.stats.pageviews.value, stats.stats.pageviews.prev)).toFixed(1)}% from previous
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Unique Visitors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatNumber(stats.stats.visitors.value)}</div>
                      {stats.stats.visitors.prev > 0 && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${
                          (stats.stats.visitors.value - stats.stats.visitors.prev) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(stats.stats.visitors.value - stats.stats.visitors.prev) >= 0 ? '↑' : '↓'}
                          {Math.abs(calculateChange(stats.stats.visitors.value, stats.stats.visitors.prev)).toFixed(1)}% from previous
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Bounce Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {stats.stats.visits.value > 0 
                          ? Math.round((stats.stats.bounces.value / stats.stats.visits.value) * 100)
                          : 0}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatNumber(stats.stats.bounces.value)} bounces
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Global Reach
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatNumber(stats.sessionStats.countries.value)}</div>
                      <p className="text-xs text-muted-foreground mt-1">Countries reached</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Detailed Reports - Top Metrics Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top URLs Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Top URLs Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.urls.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topMetrics.urls.map((url, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                              <span className="text-sm text-gray-700 truncate">{url.x}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm">{formatNumber(url.y)}</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{ 
                                    width: `${stats.stats.pageviews.value > 0 ? (url.y / stats.stats.pageviews.value) * 100 : 0}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Geographic Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Geographic Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.topMetrics.countries.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topMetrics.countries.map((country, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{country.x}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm">{formatNumber(country.y)}</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ 
                                    width: `${stats.stats.visitors.value > 0 ? (country.y / stats.stats.visitors.value) * 100 : 0}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-8 text-center">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Technology Stack Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Technology Stack</CardTitle>
                  <CardDescription className="text-xs">Browser, OS, and Device distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Browsers Breakdown */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Browsers</h4>
                      <div className="space-y-2">
                        {stats.topMetrics.browsers.slice(0, 5).map((browser, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {getBrowserIcon(browser.x)}
                            <span className="text-sm flex-1">{browser.x}</span>
                            <span className="text-xs text-gray-500">
                              {stats.stats.visitors.value > 0 
                                ? Math.round((browser.y / stats.stats.visitors.value) * 100) 
                                : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* OS Breakdown */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Operating Systems</h4>
                      <div className="space-y-2">
                        {stats.topMetrics.os.slice(0, 5).map((os, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {getOSIcon(os.x)}
                            <span className="text-sm flex-1">{os.x}</span>
                            <span className="text-xs text-gray-500">
                              {stats.stats.visitors.value > 0 
                                ? Math.round((os.y / stats.stats.visitors.value) * 100) 
                                : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Devices Breakdown */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Devices</h4>
                      <div className="space-y-2">
                        {stats.topMetrics.devices.slice(0, 5).map((device, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {getDeviceIcon(device.x)}
                            <span className="text-sm flex-1">{device.x}</span>
                            <span className="text-xs text-gray-500">
                              {stats.stats.visitors.value > 0 
                                ? Math.round((device.y / stats.stats.visitors.value) * 100) 
                                : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      )}
    </div>
  );
}
