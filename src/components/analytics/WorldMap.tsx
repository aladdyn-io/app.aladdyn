import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock data for demo purposes - analytics data
const mockAnalyticsData = [
  { country: 'United States', code: 'us', value: 1250, percentage: 28 },
  { country: 'United Kingdom', code: 'gb', value: 890, percentage: 20 },
  { country: 'Canada', code: 'ca', value: 650, percentage: 15 },
  { country: 'Germany', code: 'de', value: 420, percentage: 10 },
  { country: 'France', code: 'fr', value: 380, percentage: 8 },
  { country: 'Japan', code: 'jp', value: 320, percentage: 7 },
  { country: 'Australia', code: 'au', value: 280, percentage: 6 },
  { country: 'India', code: 'in', value: 300, percentage: 6 },
];

/**
 * WorldMap Component
 * 
 * Props shape:
 * data: Array of country analytics data (optional)
 * [
 *   {
 *     country: string (country name),
 *     code: string (ISO 3166-1 alpha-2 code lowercase, e.g., 'us', 'gb'),
 *     value: number (visits/analytics value),
 *     percentage: number (percentage of total visits)
 *   }
 * ]
 */
interface CountryData {
  country: string;
  code: string;
  value: number;
  percentage: number;
}

interface WorldMapProps {
  data?: CountryData[];
}

export default function WorldMapComponent({ data = mockAnalyticsData }: WorldMapProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  // Get color based on value intensity
  const getBarColor = (value: number) => {
    const intensity = (value / maxValue) * 100;
    if (intensity > 66) return '#059669'; // emerald-600
    if (intensity > 33) return '#34D399'; // emerald-400
    return '#6EE7B7'; // emerald-300
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Visitors by Country
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Geographic distribution of your visitors
          </p>
        </div>

        {/* Geographic Distribution Chart */}
        <div className="w-full" style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="country" type="category" width={90} />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} visits`, 'Visitors']}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '6px', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Countries List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.slice(0, 6).map((item) => (
            <div
              key={item.code}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-700 text-sm">{item.country}</span>
              <span className="text-emerald-600 font-semibold text-sm">
                {item.value.toLocaleString()} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-600" />
            <span className="text-sm text-gray-600">High traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-400" />
            <span className="text-sm text-gray-600">Medium traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-300" />
            <span className="text-sm text-gray-600">Low traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-gray-200" />
            <span className="text-sm text-gray-600">No data</span>
          </div>
        </div>
      </div>
    </div>
  );
}