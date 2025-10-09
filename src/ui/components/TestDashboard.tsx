import React from 'react';
import { DashboardTable } from './table/DashboardTable';

export const TestDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Genie Dashboard</h1>
          <p className="text-gray-600">Welcome to your AI-powered Genie workspace. Monitor performance and manage your intelligent agents.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">$1,250.00</span>
              <span className="text-sm font-medium text-emerald-600">(+12.5%)</span>
            </div>
            <p className="text-sm text-gray-500">Trending up this month</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">New Customers</h3>
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">1,234</span>
              <span className="text-sm font-medium text-red-500">(-20%)</span>
            </div>
            <p className="text-sm text-gray-500">Acquisition needs attention</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Accounts</h3>
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">45,678</span>
              <span className="text-sm font-medium text-emerald-600">(+12.5%)</span>
            </div>
            <p className="text-sm text-gray-500">Strong user retention</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Growth Rate</h3>
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">4.5%</span>
              <span className="text-sm font-medium text-emerald-600">(+4.5%)</span>
            </div>
            <p className="text-sm text-gray-500">Steady performance increase</p>
          </div>
        </div>
        
        <DashboardTable />
      </div>
    </div>
  );
};