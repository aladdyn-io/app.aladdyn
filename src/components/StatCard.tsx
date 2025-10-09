import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  description: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, change, changeType, description, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-emerald-500">{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'
          }`}>
            ({changeType === 'positive' ? '+' : ''}{change})
          </span>
        </div>
        
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}