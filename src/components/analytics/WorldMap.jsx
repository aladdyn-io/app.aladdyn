import React from 'react';
import { WorldMap } from 'react-svg-worldmap';

// Mock data for demo purposes - analytics data
const mockAnalyticsData = [
  { country: 'us', value: 1250 }, // United States
  { country: 'gb', value: 890 },  // United Kingdom
  { country: 'ca', value: 650 },  // Canada
  { country: 'de', value: 420 },  // Germany
  { country: 'fr', value: 380 },  // France
  { country: 'jp', value: 320 },  // Japan
  { country: 'au', value: 280 },  // Australia
  { country: 'br', value: 240 },  // Brazil
  { country: 'in', value: 200 },  // India
  { country: 'cn', value: 180 },  // China
  { country: 'es', value: 160 },  // Spain
  { country: 'it', value: 140 },  // Italy
  { country: 'nl', value: 120 },  // Netherlands
  { country: 'se', value: 100 },  // Sweden
  { country: 'no', value: 80 }    // Norway
];

/**
 * WorldMap Component
 * 
 * Props shape:
 * data: Array of country analytics data (optional)
 * [
 *   {
 *     country: string (ISO 3166-1 alpha-2 code lowercase, e.g., 'us', 'gb'),
 *     value: number (visits/analytics value)
 *   }
 * ]
 * 
 * Note: Requires 'react-svg-worldmap' package
 * Install with: npm install react-svg-worldmap
 */
export default function WorldMapComponent({ data = mockAnalyticsData }) {
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
        
        <div className="flex items-center justify-center">
          <WorldMap
            color="#059669"
            title=""
            value-suffix=" visits"
            size="lg"
            data={data}
            tooltipBgColor="#ffffff"
            tooltipTextColor="#000000"
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-600" />
            <span className="text-sm text-gray-600">High traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-300" />
            <span className="text-sm text-gray-600">Medium traffic</span>
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