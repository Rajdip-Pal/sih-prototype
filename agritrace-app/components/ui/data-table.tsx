'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T = unknown> {
  title: string;
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  searchable = true,
  filterable = true,
  exportable = true,
  className,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    Object.values(item as Record<string, unknown>).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = (a as Record<string, unknown>)[sortColumn];
    const bValue = (b as Record<string, unknown>)[sortColumn];

    // Convert values to string for comparison, or you can use Number() if you expect numbers
    const aComp = typeof aValue === 'number' ? aValue : String(aValue);
    const bComp = typeof bValue === 'number' ? bValue : String(bValue);

    if (aComp < bComp) return sortDirection === 'asc' ? -1 : 1;
    if (aComp > bComp) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{title}</CardTitle>
          <div className='flex items-center gap-2'>
            {filterable && (
              <Button variant='outline' size='sm' className='bg-transparent'>
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            )}
            {exportable && (
              <Button variant='outline' size='sm' className='bg-transparent'>
                <Download className='w-4 h-4 mr-2' />
                Export
              </Button>
            )}
          </div>
        </div>
        {searchable && (
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'text-left p-3 font-medium text-muted-foreground',
                      column.sortable && 'cursor-pointer hover:text-foreground'
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className='flex items-center gap-2'>
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        <span className='text-xs'>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className='text-left p-3 font-medium text-muted-foreground'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className='border-b hover:bg-muted/50'>
                  {columns.map((column) => (
                    <td key={column.key} className='p-3'>
                      {column.render
                        ? column.render((row as T)[column.key], row as T)
                        : ((row as T)[column.key] as React.ReactNode)}
                    </td>
                  ))}
                  <td className='p-3'>
                    <div className='flex items-center gap-2'>
                      <Button variant='ghost' size='sm'>
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='w-4 h-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between mt-4'>
            <p className='text-sm text-muted-foreground'>
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + itemsPerPage, sortedData.length)} of{' '}
              {sortedData.length} results
            </p>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className='bg-transparent'
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>
              <span className='text-sm'>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className='bg-transparent'
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
