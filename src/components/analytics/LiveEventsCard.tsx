import { useState, useEffect } from 'react';

// Mock events for demo purposes
const mockEvents = [
  { id: 1, type: 'pageview', time: '2 seconds ago', payload: { path: '/dashboard' } },
  { id: 2, type: 'click', time: '15 seconds ago', payload: { element: 'nav-button' } },
  { id: 3, type: 'pageview', time: '32 seconds ago', payload: { path: '/analytics' } },
  { id: 4, type: 'session_start', time: '1 minute ago', payload: { referrer: 'google.com' } },
  { id: 5, type: 'pageview', time: '2 minutes ago', payload: { path: '/home' } }
];

/**
 * LiveEventsCard Component
 * 
 * Props shape:
 * events: Array of event objects
 * [
 *   {
 *     id: string | number,
 *     type: string (e.g., 'pageview', 'click', 'session_start'),
 *     time: string (e.g., '2 seconds ago'),
 *     payload: object (event-specific data)
 *   }
 * ]
 */
export default function LiveEventsCard({ events = mockEvents }) {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate live status blinking
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'pageview':
        return '👁️';
      case 'click':
        return '👆';
      case 'session_start':
        return '🚀';
      default:
        return '📊';
    }
  };

  const getEventDescription = (event: any) => {
    switch (event.type) {
      case 'pageview':
        return `Viewed ${event.payload?.path || 'page'}`;
      case 'click':
        return `Clicked ${event.payload?.element || 'element'}`;
      case 'session_start':
        return `New session from ${event.payload?.referrer || 'direct'}`;
      default:
        return `${event.type} event`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800/20 to-violet-800/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 shadow-2xl shadow-purple-500/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white drop-shadow-lg">🔮 Live Magic</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-emerald-300'} transition-colors`}></div>
          <span className="text-sm text-purple-200">Casting Spells</span>
        </div>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-purple-300">Awaiting magical manifestations...</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="flex-shrink-0 text-lg">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getEventDescription(event)}
                  </p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}