import React from 'react';

export const TestTable: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">TEST TABLE COMPONENT</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Simple Test Table</h2>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left">Header</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Reviewer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2">Cover page</td>
              <td className="border border-gray-200 px-4 py-2">In Process</td>
              <td className="border border-gray-200 px-4 py-2">Eddie Lake</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">Table of contents</td>
              <td className="border border-gray-200 px-4 py-2">Done</td>
              <td className="border border-gray-200 px-4 py-2">Eddie Lake</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">Executive summary</td>
              <td className="border border-gray-200 px-4 py-2">Done</td>
              <td className="border border-gray-200 px-4 py-2">Eddie Lake</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};