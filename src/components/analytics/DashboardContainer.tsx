
import MetricCards from './MetricCards';
import HourlyLineChart from './HourlyLineChart';
import SummaryCardsGrid from './SummaryCardsGrid';
import WorldMap from './WorldMap';

// Real Umami data structure
const umamiSampleData = {
  stats: {
    pageviews: { value: 487, prev: 320 },
    visitors: { value: 178, prev: 110 },
    visits: { value: 195, prev: 120 },
    bounces: { value: 47, prev: 32 },
    totaltime: { value: 6845, prev: 4210 }
  },
  topMetrics: {
    urls: [
      { x: '/', y: 190 },
      { x: '/pricing', y: 72 },
      { x: '/dashboard', y: 58 },
      { x: '/contact', y: 33 },
      { x: '/features', y: 45 },
      { x: '/login', y: 89 }
    ],
    referrers: [
      { x: 'google.com', y: 120 },
      { x: 'twitter.com', y: 48 },
      { x: 'linkedin.com', y: 30 },
      { x: 'github.com', y: 15 },
      { x: null, y: 55 }
    ],
    countries: [
      { x: 'IN', y: 90 },
      { x: 'US', y: 70 },
      { x: 'GB', y: 35 },
      { x: 'CA', y: 28 },
      { x: 'DE', y: 25 },
      { x: 'AU', y: 18 },
      { x: 'FR', y: 15 }
    ]
  },
  timeseries: {
    pageviews: [
      { x: '2025-09-28 00:00:00', y: 45 },
      { x: '2025-09-29 00:00:00', y: 60 },
      { x: '2025-09-30 00:00:00', y: 72 },
      { x: '2025-10-01 00:00:00', y: 88 },
      { x: '2025-10-02 00:00:00', y: 65 },
      { x: '2025-10-03 00:00:00', y: 70 },
      { x: '2025-10-04 00:00:00', y: 52 },
      { x: '2025-10-05 00:00:00', y: 55 },
      { x: '2025-10-06 00:00:00', y: 62 },
      { x: '2025-10-07 00:00:00', y: 68 }
    ],
    sessions: [
      { x: '2025-09-28 00:00:00', y: 18 },
      { x: '2025-09-29 00:00:00', y: 22 },
      { x: '2025-09-30 00:00:00', y: 26 },
      { x: '2025-10-01 00:00:00', y: 31 },
      { x: '2025-10-02 00:00:00', y: 19 },
      { x: '2025-10-03 00:00:00', y: 20 },
      { x: '2025-10-04 00:00:00', y: 16 },
      { x: '2025-10-05 00:00:00', y: 17 },
      { x: '2025-10-06 00:00:00', y: 22 },
      { x: '2025-10-07 00:00:00', y: 24 }
    ]
  }
};

// Transform Umami data to component format
const transformUmamiData = (data: any) => {
  const calculateDelta = (current: number, prev: number) => {
    if (prev === 0) return null;
    const delta = ((current - prev) / prev * 100).toFixed(1);
    const deltaNum = parseFloat(delta);
    return deltaNum > 0 ? `+${delta}%` : `${delta}%`;
  };

  return {
    metrics: [
      { id: 'pageviews', title: 'Page Views', value: data.stats.pageviews.value, subtitle: 'Total page views', delta: calculateDelta(data.stats.pageviews.value, data.stats.pageviews.prev) },
      { id: 'visitors', title: 'Visitors', value: data.stats.visitors.value, subtitle: 'Unique visitors', delta: calculateDelta(data.stats.visitors.value, data.stats.visitors.prev) },
      { id: 'visits', title: 'Visits', value: data.stats.visits.value, subtitle: 'Unique sessions', delta: calculateDelta(data.stats.visits.value, data.stats.visits.prev) },
      { id: 'bounces', title: 'Bounces', value: data.stats.bounces.value, subtitle: 'Single page visits', delta: calculateDelta(data.stats.bounces.value, data.stats.bounces.prev) },
      { id: 'totaltime', title: 'Total Time', value: `${Math.floor(data.stats.totaltime.value / 60)}m ${data.stats.totaltime.value % 60}s`, subtitle: 'Total session time', delta: calculateDelta(data.stats.totaltime.value, data.stats.totaltime.prev) }
    ],
    pages: data.topMetrics.urls.map((url: any) => ({ path: url.x || 'Direct', count: url.y })),
    countries: data.topMetrics.countries.map((country: any) => ({ name: country.x, count: country.y })),
    referrers: data.topMetrics.referrers.map((ref: any) => ({ name: ref.x || 'Direct', count: ref.y })),
    worldMapData: data.topMetrics.countries.map((country: any) => ({ country: country.x.toLowerCase(), value: country.y })),
    hourlyData: data.timeseries.pageviews.map((item: any) => ({ 
      hour: new Date(item.x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      visitors: data.timeseries.sessions.find((s: any) => s.x === item.x)?.y || 0, 
      views: item.y 
    })),
    events: [
      { id: 1, type: 'pageview', time: '2 seconds ago', payload: { path: '/' } },
      { id: 2, type: 'session_start', time: '1 minute ago', payload: { referrer: 'google.com' } }
    ]
  };
};

const mockInitialData = transformUmamiData(umamiSampleData);

/**
 * DashboardContainer Component
 * 
 * Props shape:
 * initialData: {
 *   metrics: Array (see MetricCards props),
 *   hourlyData: Array (see HourlyLineChart props),
 *   events: Array (see LiveEventsCard props),
 *   pages: Array (see SummaryCardsGrid props),
 *   countries: Array (see SummaryCardsGrid props),
 *   referrers: Array (see SummaryCardsGrid props),
 *   worldMapData: Array (see WorldMap props)
 * }
 */
export default function DashboardContainer({ initialData = mockInitialData }: { initialData?: any }) {
  const {
    metrics,
    hourlyData,
    pages,
    countries,
    referrers,
    worldMapData
  } = initialData;

  return (
    <div className="space-y-6">
      {/* Metrics Cards Row */}
      <MetricCards metrics={metrics} />
      
      {/* Chart Row */}
      <HourlyLineChart data={hourlyData} />
      
      {/* World Map Row */}
      <WorldMap data={worldMapData} />
      
      {/* Summary Cards Row */}
      <SummaryCardsGrid 
        pages={pages}
        countries={countries}
        referrers={referrers}
      />
    </div>
  );
}