import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
// URL | Target Price | Current Price | Notes | Notification Checkbox | Deletion Checkbox

export type TrackedProduct = {
  url: string;
  target_price: number;
  current_price: number;
  notes: string;
  notify: boolean;
  delete: () => void;
};

export const columns = (updateNotify: (url: string, checked: boolean) => void): ColumnDef<TrackedProduct>[] = [
  // {
  //   id: 'notify',
  //   cell: ({ row }) => {
  //     const trackedProduct = row.original;

  //     // const handleOnCheckedChange = (checkedState: CheckedState) => {
  //     //   console.log(checkedState);
  //     //   setChecked(!checked);
  //     // };

  //     return (
  //       <Checkbox
  //       checked={trackedProduct.notify}
  //       onCheckedChange={(checked) => }
  //         // checked={checked}
  //         // onCheckedChange={handleOnCheckedChange}
  //       ></Checkbox>
  //     );
  //   },
  // },
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
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
  },
];
