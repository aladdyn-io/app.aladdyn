

import type { ReactNode } from 'react';

// Type definitions
interface PageItem {
  path: string;
  count: number;
}

interface CountryItem {
  name: string;
  count: number;
}

interface ReferrerItem {
  name: string;
  count: number;
}

type SummaryItem = PageItem | CountryItem | ReferrerItem;

interface SummaryCardProps {
  title: string;
  items: SummaryItem[];
  icon: ReactNode;
}

interface SummaryCardsGridProps {
  pages?: PageItem[];
  countries?: CountryItem[];
  referrers?: ReferrerItem[];
  maxItems?: number;
}

// Mock data for demo purposes
const mockPages = [
  { path: '/dashboard', count: 45 },
  { path: '/analytics', count: 32 },
  { path: '/settings', count: 18 },
  { path: '/profile', count: 12 },
  { path: '/help', count: 8 }
];

const mockCountries = [
  { name: 'United States', count: 28 },
  { name: 'United Kingdom', count: 15 },
  { name: 'Canada', count: 12 },
  { name: 'Germany', count: 9 },
  { name: 'France', count: 6 }
];

const mockReferrers = [
  { name: 'google.com', count: 35 },
  { name: 'Direct', count: 22 },
  { name: 'twitter.com', count: 18 },
  { name: 'linkedin.com', count: 10 },
  { name: 'github.com', count: 5 }
];

/**
 * SummaryCardsGrid Component
 * 
 * Props shape:
 * pages: Array of page objects [{ path: string, count: number }]
 * countries: Array of country objects [{ name: string, count: number }]
 * referrers: Array of referrer objects [{ name: string, count: number }]
 * maxItems: number (optional, default: 5) - max items to show per card
 */
export default function SummaryCardsGrid({ 
  pages = mockPages, 
  countries = mockCountries, 
  referrers = mockReferrers,
  maxItems = 5 
}: SummaryCardsGridProps) {
  const SummaryCard = ({ title, items, icon }: SummaryCardProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="space-y-3">
        {items.slice(0, maxItems).map((item: SummaryItem, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {'path' in item ? item.path : item.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">{item.count}</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((item.count / Math.max(...items.map((i: SummaryItem) => i.count))) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        {items.length > maxItems && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              +{items.length - maxItems} more
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SummaryCard 
        title="Top Pages" 
        items={pages}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
      
      <SummaryCard 
        title="Top Countries" 
        items={countries}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      
      <SummaryCard 
        title="Top Referrers" 
        items={referrers}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        }
      />
    </div>
  );
}