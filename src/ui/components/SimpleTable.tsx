import React from 'react';

export const SimpleTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Sections</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Header</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviewer</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-900">Cover page</td>
              <td className="px-4 py-3 text-sm text-gray-600">Cover page</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  In Process
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">Eddie Lake</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-900">Table of contents</td>
              <td className="px-4 py-3 text-sm text-gray-600">Table of contents</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Done
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">Eddie Lake</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-900">Executive summary</td>
              <td className="px-4 py-3 text-sm text-gray-600">Narrative</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Done
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">Eddie Lake</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};