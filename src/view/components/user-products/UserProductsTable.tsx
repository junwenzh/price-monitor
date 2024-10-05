import React, { useEffect, useState } from 'react';
// import {
//   useReactTable,
//   getCoreRowModel,
//   ColumnDef,
// } from '@tanstack/react-table';
import { TrackedProduct, columns } from './columns';
import { DataTable } from '../ui/datatable';
//import { Product } from '../TrackingHistory';

// Product is a single product from database query
export interface Product {
  url: string;
  user_note: string;
  target_price: number;
  price: number;
  price_timestamp: string;
  notify: boolean;
}

export default function DemoPage() {
  const username = 'jun';

  // this contains the data for the table
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [error, setError] = useState<string>('');

  // //popup confirming change in notification status
  // const confirmNotifyChange = (rowIndex: number) => {
  //   const confirmed = window.confirm(
  //     'Confirm that you would like to change your notification status?'
  //   );
  //   if (confirmed) {
  //     toggleNotify(rowIndex);
  //   }
  // };

  // Toggle notification status for a product
  // const toggleNotify = (rowIndex: number) => {
  //   const updatedData = products.map((row, index) =>
  //     index === rowIndex ? { ...row, notify: !row.notify } : row
  //   );
  //   setProducts(updatedData);

  // // Handle delete flag toggle
  // const toggleDeleteFlag = (rowIndex: number) => {
  //   const updatedData = products.map((row, index) =>
  //     index === rowIndex ? { ...row, deleteFlag: !row.deleteFlag } : row
  //   );
  //   setProducts(updatedData);
  // };

  // // Handle deletion of a product
  // const handleDelete = async (url: string) => {
  //   try {
  //     const response = await fetch(`/api/price/delete`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ url }),
  //     });

  //     if (!response.ok) throw new Error('Failed to delete item');

  //     // Refresh table after deleting
  //     setProducts(prevProducts =>
  //       prevProducts.filter(product => product.url !== url)
  //     );
  //   } catch (error) {
  //     console.error('Error deleting tracked item', error);
  //     setError('Failed to delete item');
  //   }
  // };

  // // toggle price edit
  // const toggleEditPrice = (rowIndex: number) => {
  //   const updatedData = products.map((row, index) =>
  //     index === rowIndex ? { ...row, isEditingPrice: !row.isEditingPrice } : row
  //   );
  //   setProducts(updatedData);
  // };

  // // updating target price
  // const updateTargetPrice = async (rowIndex: number, newTargetPrice: number) => {
  //   const updatedData = products.map((row, index) =>
  //     index === rowIndex
  //       ? { ...row, target_price: newTargetPrice, isEditingPrice: false }
  //       : row
  //   );
  //   setProducts(updatedData);

  //   const url = products[rowIndex].url;
  //   fetch(`/api/price/update`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ url, target_price: newTargetPrice }),
  //   });
  // };

  // initialize the data on component load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/price/${username}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        const products = data.data as Product[];

        const temp: TrackedProduct[] = products.map((product: Product) => {
          return {
            url: product.url,
            target_price: product.target_price,
            current_price: product.price,
            notes: product.user_note,
            notify: product.notify,
            // deleteFlag: false,
            // isEditingPrice: false,
            // // toggleNotify: toggleNotify,
            // // confirmNotifyChange: confirmNotifyChange,
            // // toggleDeleteFlag: toggleDeleteFlag,
            // delete: () => handleDelete(product.url),
            // toggleEditPrice: toggleEditPrice,
            // updateTargetPrice: updateTargetPrice,
          };
        });

        setProducts(temp);
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-10">
      {error && <p className="text-red-500">{error}</p>}
      <DataTable columns={columns} data={products} />
    </div>
  );
}
