import React from 'react';

// Mock data for demo purposes
const mockMetrics = [
  { id: 'live', title: 'Live Visitors', value: 0, subtitle: 'Currently online', delta: null },
  { id: 'views', title: 'Views', value: 14, subtitle: 'Total page views', delta: '+12%' },
  { id: 'visits', title: 'Visits', value: 8, subtitle: 'Unique sessions', delta: '+8%' },
  { id: 'visitors', title: 'Visitors', value: 6, subtitle: 'Unique visitors', delta: '+15%' },
  { id: 'bounce', title: 'Bounce Rate', value: '50%', subtitle: 'Single page visits', delta: '-3%' },
  { id: 'duration', title: 'Visit Duration', value: '2m 15s', subtitle: 'Average time', delta: '+5%' }
];

/**
 * MetricCards Component
 * 
 * Props shape:
 * metrics: Array of metric objects
 * [
 *   {
 *     id: string,
 *     title: string,
 *     value: string | number,
 *     subtitle: string,
 *     delta: string | null (e.g., '+12%', '-3%')
 *   }
 * ]
 */
export default function MetricCards({ metrics = mockMetrics }) {
  const getDeltaColor = (delta) => {
    if (!delta) return '';
    if (delta.startsWith('+')) return 'text-emerald-600 bg-emerald-50';
    if (delta.startsWith('-')) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
            {metric.delta && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDeltaColor(metric.delta)}`}>
                {metric.delta}
              </span>
            )}
          </div>
          <div className="mb-1">
            <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
          </div>
          <p className="text-xs text-gray-500">{metric.subtitle}</p>
        </div>
      ))}
    </div>
  );
}