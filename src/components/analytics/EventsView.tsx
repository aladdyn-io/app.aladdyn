

export default function EventsView() {
  const eventData = [
    { event: 'button_click', count: 18, description: 'Button interactions' },
    { event: 'signup', count: 8, description: 'User registrations' },
    { event: 'page_scroll', count: 10, description: 'Page scroll events' },
    { event: 'download', count: 6, description: 'File downloads' },
    { event: 'form_submit', count: 12, description: 'Form submissions' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">42</div>
            <p className="text-sm text-gray-600">Total Events</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">123</div>
            <p className="text-sm text-gray-600">Event Properties</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <p className="text-sm text-gray-600">Event Types</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Breakdown</h3>
        <div className="space-y-4">
          {eventData.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{event.event}</h4>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{event.count}</div>
                <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${(event.count / Math.max(...eventData.map(e => e.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}