import React from 'react';

export default function ReportsView() {
  const reportData = [
    { metric: 'Total Page Views', current: 487, previous: 320, change: '+52.2%' },
    { metric: 'Unique Visitors', current: 178, previous: 110, change: '+61.8%' },
    { metric: 'Total Sessions', current: 195, previous: 120, change: '+62.5%' },
    { metric: 'Bounce Rate', current: '24%', previous: '27%', change: '-11.1%' },
    { metric: 'Avg Session Duration', current: '2m 45s', previous: '2m 12s', change: '+25.0%' }
  ];

  const topContent = [
    { page: '/', views: 190, percentage: 39 },
    { page: '/login', views: 89, percentage: 18 },
    { page: '/pricing', views: 72, percentage: 15 },
    { page: '/dashboard', views: 58, percentage: 12 },
    { page: '/features', views: 45, percentage: 9 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Metric</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Current Period</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Previous Period</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Change</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{item.metric}</td>
                  <td className="py-3 px-4 text-right font-semibold">{item.current}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{item.previous}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    item.change.startsWith('+') ? 'text-green-600' : 
                    item.change.startsWith('-') && item.metric === 'Bounce Rate' ? 'text-green-600' : 
                    item.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {item.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
          <div className="space-y-3">
            {topContent.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{item.page}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.views}</div>
                  <div className="text-xs text-gray-600">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800">📈 Strong Growth</h4>
              <p className="text-sm text-green-700 mt-1">Visitor count increased by 61.8% compared to the previous period.</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800">🎯 Improved Engagement</h4>
              <p className="text-sm text-blue-700 mt-1">Bounce rate decreased by 11.1%, indicating better user engagement.</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800">⏱️ Longer Sessions</h4>
              <p className="text-sm text-purple-700 mt-1">Average session duration increased by 25%, showing improved content quality.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}