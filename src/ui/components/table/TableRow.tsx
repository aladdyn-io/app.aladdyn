import React from 'react';
import { GripVertical, MoreHorizontal } from 'lucide-react';

interface TableRowProps {
  data: {
    id: string;
    header: string;
    sectionType: string;
    status: 'Done' | 'In Process';
    target: string;
    limit: string;
    reviewer: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ data, isSelected, onSelect }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(data.id)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">{data.header}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{data.sectionType}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          data.status === 'Done'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            data.status === 'Done' ? 'bg-emerald-400' : 'bg-yellow-400'
          }`} />
          {data.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{data.target}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{data.limit}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{data.reviewer}</td>
      <td className="px-4 py-3">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};