import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
// import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import ProductDetails from './ProductDetails';

import { useNavigate } from 'react-router-dom';
// URL | Target Price | Current Price | Notes | Notification Checkbox | Deletion Checkbox

export type TrackedProduct = {
  url: string;
  target_price: number;
  current_price: number;
  notes: string;
  notify: boolean;
  // deleteFlag: boolean;
  // toggleNotify: (index: number) => void;
  // confirmNotifyChange: (index: number) => void;
  // toggleDeleteFlag: (index: number) => void;
  // delete: () => void;
  // toggleEditPrice: (index: number) => void;
  // updateTargetPrice: (index: number, newPrice: number) => void;
  // isEditingPrice: boolean;
};

export const columns: ColumnDef<TrackedProduct>[] = [
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'target_price',
    header: 'Target Price',
    // cell: ({ row }) => {
    //   const trackedProduct = row.original;

    //   // Edit button for target price
    //   return trackedProduct.isEditingPrice ? (
    //     <input
    //       type="number"
    //       defaultValue={trackedProduct.target_price}
    //       onBlur={e =>
    //         trackedProduct.updateTargetPrice(
    //           row.index,
    //           parseFloat(e.target.value)
    //         )
    //       }
    //       onKeyDown={e => {
    //         if (e.key === 'Enter') {
    //           trackedProduct.updateTargetPrice(
    //             row.index,
    //             parseFloat((e.target as HTMLInputElement).value)
    //           );
    //         }
    //       }}
    //       className="border p-1 w-full"
    //     />
    //   ) : (
    //     <>
    //       {trackedProduct.target_price}
    //       <Button
    //         className="ml-2"
    //         onClick={() => trackedProduct.toggleEditPrice(row.index)}
    //       >
    //         Edit
    //       </Button>
    //     </>
    //   );
    // },
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
    cell: ({ row }) => {
      // const trackedProduct = row.original;

      // Need a confirm pop-up before sending change to backend
      return (
        <div>{row.original.notify ? 'Y' : 'N'}</div>
        // <Checkbox
        //   checked={trackedProduct.notify}
        //   // onChange={() => trackedProduct.confirmNotifyChange(row.index)}
        // />
      );
    },
  },
  {
    // accessorKey: 'edit',
    header: 'Edit',
    cell: ({ row }) => {
      const handleClick = () => {
        console.log(row.original);
      };

      const navigate = useNavigate();

      const data = row.original;

      const handleNavigate = () => {
        navigate('/productdetails', { state: data });
      };

      // const productId = row.original.url;
      // const handleNavigate = () => {
      //   navigate(`/product?url=${encodeURIComponent(productId)}`);
      // };
      return <Button onClick={handleNavigate}>Edit </Button>;
    },
  },
  // {
  //   accessorKey: 'deleteFlag',
  //   header: 'Delete?',
  //   cell: ({ row }) => {
  //     const trackedProduct = row.original;

  //     return (
  //       <Checkbox
  //         checked={trackedProduct.deleteFlag}
  //         onChange={() => trackedProduct.toggleDeleteFlag(row.index)}
  //       />
  //     );
  //   },
  // },
  // {
  //   id: 'delete_button',
  //   header: 'Delect Confirmation',
  //   cell: ({ row }) => {
  //     const trackedProduct = row.original;

  //     return (
  //       <Button
  //         className="bg-red-500 text-white px-3 py-1 rounded"
  //         onClick={trackedProduct.delete}
  //         disabled={!trackedProduct.deleteFlag}
  //       >
  //         Delete?
  //       </Button>
  //     );
  //   },
  // },
];
