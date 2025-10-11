
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for demo purposes
const mockData = [
  { hour: '00:00', visitors: 2, views: 5 },
  { hour: '01:00', visitors: 1, views: 2 },
  { hour: '02:00', visitors: 0, views: 0 },
  { hour: '03:00', visitors: 1, views: 1 },
  { hour: '04:00', visitors: 0, views: 0 },
  { hour: '05:00', visitors: 2, views: 3 },
  { hour: '06:00', visitors: 3, views: 6 },
  { hour: '07:00', visitors: 4, views: 8 },
  { hour: '08:00', visitors: 6, views: 12 },
  { hour: '09:00', visitors: 8, views: 15 },
  { hour: '10:00', visitors: 5, views: 10 },
  { hour: '11:00', visitors: 7, views: 14 },
  { hour: '12:00', visitors: 9, views: 18 },
  { hour: '13:00', visitors: 6, views: 11 },
  { hour: '14:00', visitors: 8, views: 16 },
  { hour: '15:00', visitors: 10, views: 20 },
  { hour: '16:00', visitors: 7, views: 13 },
  { hour: '17:00', visitors: 5, views: 9 },
  { hour: '18:00', visitors: 4, views: 7 },
  { hour: '19:00', visitors: 3, views: 5 },
  { hour: '20:00', visitors: 2, views: 4 },
  { hour: '21:00', visitors: 1, views: 2 },
  { hour: '22:00', visitors: 1, views: 1 },
  { hour: '23:00', visitors: 0, views: 0 }
];

/**
 * HourlyLineChart Component
 * 
 * Props shape:
 * data: Array of hourly data objects
 * [
 *   {
 *     hour: string (e.g., '01:00'),
 *     visitors: number,
 *     views: number
 *   }
 * ]
 * 
 * Note: Requires 'recharts' package
 * Install with: npm install recharts
 */
interface ChartData {
  hour: string;
  visitors: number;
  views: number;
}

interface HourlyLineChartProps {
  data?: ChartData[];
}

export default function HourlyLineChart({ data = mockData }: HourlyLineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-900">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Visitors and Views by Hour (Today)</h3>
        <p className="text-sm text-gray-600">Hourly breakdown of site activity</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="hour" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="visitors" 
              stroke="#059669" 
              strokeWidth={2}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
              name="Visitors"
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Views"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}