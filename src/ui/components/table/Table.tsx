import React from 'react';
import { TableRow } from './TableRow';

interface TableData {
  id: string;
  header: string;
  sectionType: string;
  status: 'Done' | 'In Process';
  target: string;
  limit: string;
  reviewer: string;
}

interface TableProps {
  data: TableData[];
  selectedRows: string[];
  onRowSelect: (id: string) => void;
  onSelectAll: () => void;
}

export const Table: React.FC<TableProps> = ({ data, selectedRows, onRowSelect, onSelectAll }) => {
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                data={row}
                isSelected={selectedRows.includes(row.id)}
                onSelect={onRowSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};