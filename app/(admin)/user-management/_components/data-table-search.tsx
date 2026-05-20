'use client';

import { Search } from 'lucide-react';
import { Input } from '@/app/_components/ui/input';
import type { Table } from '@tanstack/react-table';

interface DataTableSearchProps<TData> {
  table: Table<TData>;
  columnKey: string;
  placeholder?: string;
}

export function DataTableSearch<TData>({
  table,
  columnKey,
  placeholder = 'Search...',
}: DataTableSearchProps<TData>) {
  return (
    <div className="relative w-full sm:w-md">
      <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={(table.getColumn(columnKey)?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn(columnKey)?.setFilterValue(event.target.value)
        }
        className="w-full pl-8 h-8 text-xs"
      />
    </div>
  );
}
