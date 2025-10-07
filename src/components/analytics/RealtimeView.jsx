import React from 'react';
import LiveEventsCard from './LiveEventsCard';

export default function RealtimeView() {
  const liveEvents = [
    { id: 1, type: 'pageview', time: '2 seconds ago', payload: { path: '/' } },
    { id: 2, type: 'pageview', time: '15 seconds ago', payload: { path: '/pricing' } },
    { id: 3, type: 'session_start', time: '32 seconds ago', payload: { referrer: 'google.com' } },
    { id: 4, type: 'pageview', time: '1 minute ago', payload: { path: '/dashboard' } },
    { id: 5, type: 'click', time: '2 minutes ago', payload: { element: 'signup-button' } }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Visitors</h3>
          <div className="text-3xl font-bold text-emerald-600">12</div>
          <p className="text-sm text-gray-600">Currently online</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Views (Last Hour)</h3>
          <div className="text-3xl font-bold text-blue-600">47</div>
          <p className="text-sm text-gray-600">Views in the last 60 minutes</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">New Sessions</h3>
          <div className="text-3xl font-bold text-purple-600">8</div>
          <p className="text-sm text-gray-600">Started in the last hour</p>
        </div>
      </div>
      
      <LiveEventsCard events={liveEvents} />
    </div>
  );
}