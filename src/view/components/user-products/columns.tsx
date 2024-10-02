import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Checkbox } from '../ui/checkbox';

// URL | Target Price | Current Price | Notes | Notification Checkbox | Deletion Checkbox

export type TrackedProduct = {
  url: string;
  target_price: number;
  current_price: number;
  notes: string;
  notify: boolean;
  toggleNotify: (index: number) => void;
  delete: () => void;
};

export const columns: ColumnDef<TrackedProduct>[] = [
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'target_price',
    header: 'Target Price',
  },
  {
    accessorKey: 'current_price',
    header: 'Current Price',
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
  {
    accessorKey: 'notify',
    header: 'Notify',
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.notify}
        onChange={() => row.original.toggleNotify(row.index)}
      />
    ),
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
  },
];
