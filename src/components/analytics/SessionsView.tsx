

export default function SessionsView() {
  const sessionData = [
    { duration: '0-30s', count: 45, percentage: 23 },
    { duration: '30s-1m', count: 38, percentage: 19 },
    { duration: '1-2m', count: 52, percentage: 27 },
    { duration: '2-5m', count: 41, percentage: 21 },
    { duration: '5m+', count: 19, percentage: 10 }
  ];

  const deviceData = [
    { device: 'Desktop', sessions: 120, avgDuration: '3m 24s' },
    { device: 'Mobile', sessions: 85, avgDuration: '2m 18s' },
    { device: 'Tablet', sessions: 32, avgDuration: '4m 12s' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sessions</h3>
          <div className="text-3xl font-bold text-emerald-600">195</div>
          <p className="text-sm text-gray-600">+62.5% from last period</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Duration</h3>
          <div className="text-3xl font-bold text-blue-600">2m 45s</div>
          <p className="text-sm text-gray-600">Per session</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pages/Session</h3>
          <div className="text-3xl font-bold text-purple-600">2.5</div>
          <p className="text-sm text-gray-600">Average pages viewed</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bounce Rate</h3>
          <div className="text-3xl font-bold text-red-600">24%</div>
          <p className="text-sm text-gray-600">Single page sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Duration</h3>
          <div className="space-y-3">
            {sessionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.duration}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{item.count}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions by Device</h3>
          <div className="space-y-4">
            {deviceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{item.device}</h4>
                  <p className="text-sm text-gray-600">Avg: {item.avgDuration}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{item.sessions}</div>
                  <p className="text-sm text-gray-600">sessions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}