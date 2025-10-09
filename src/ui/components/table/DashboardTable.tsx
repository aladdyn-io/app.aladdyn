import React, { useState } from 'react';
import { TabsSection } from './TabsSection';
import { Table } from './Table';
import { Pagination } from './Pagination';

const mockData = [
  {
    id: '1',
    header: 'Cover page',
    sectionType: 'Cover page',
    status: 'In Process' as const,
    target: '18',
    limit: '5',
    reviewer: 'Eddie Lake',
  },
  {
    id: '2',
    header: 'Table of contents',
    sectionType: 'Table of contents',
    status: 'Done' as const,
    target: '29',
    limit: '24',
    reviewer: 'Eddie Lake',
  },
  {
    id: '3',
    header: 'Executive summary',
    sectionType: 'Narrative',
    status: 'Done' as const,
    target: '10',
    limit: '13',
    reviewer: 'Eddie Lake',
  },
  {
    id: '4',
    header: 'Technical approach',
    sectionType: 'Narrative',
    status: 'Done' as const,
    target: '27',
    limit: '23',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    id: '5',
    header: 'Design',
    sectionType: 'Narrative',
    status: 'In Process' as const,
    target: '2',
    limit: '16',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    id: '6',
    header: 'Capabilities',
    sectionType: 'Narrative',
    status: 'In Process' as const,
    target: '20',
    limit: '8',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    id: '7',
    header: 'Integration with existing systems',
    sectionType: 'Narrative',
    status: 'In Process' as const,
    target: '19',
    limit: '21',
    reviewer: 'Jamik Tashpulatov',
  },
  {
    id: '8',
    header: 'Innovation and Advantages',
    sectionType: 'Narrative',
    status: 'Done' as const,
    target: '25',
    limit: '26',
    reviewer: 'Assign reviewer',
  },
  {
    id: '9',
    header: 'Overview of EMR\'s Innovative Solutions',
    sectionType: 'Technical content',
    status: 'Done' as const,
    target: '7',
    limit: '23',
    reviewer: 'Assign reviewer',
  },
  {
    id: '10',
    header: 'Advanced Algorithms and Machine Learning',
    sectionType: 'Narrative',
    status: 'Done' as const,
    target: '—',
    limit: '—',
    reviewer: 'Assign reviewer',
  },
];

export const DashboardTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState('outline');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === mockData.length ? [] : mockData.map(row => row.id)
    );
  };

  return (
    <div className="space-y-6">
      <TabsSection activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="space-y-0">
        <Table
          data={mockData}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={7}
          selectedCount={selectedRows.length}
          totalRows={68}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};