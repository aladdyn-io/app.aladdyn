import React from 'react';
import { Plus } from 'lucide-react';

interface TabsSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'outline', label: 'Outline', count: null },
  { id: 'past-performance', label: 'Past Performance', count: 3 },
  { id: 'key-personnel', label: 'Key Personnel', count: 2 },
  { id: 'focus-documents', label: 'Focus Documents', count: null },
];

export const TabsSection: React.FC<TabsSectionProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex space-x-1 bg-gray-50 rounded-xl p-1 border border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {tab.label}
            {tab.count && (
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Customize Columns
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>
    </div>
  );
};