import React, { useEffect, useState } from 'react';
import { DataTable } from '../ui/datatable';
import { TrackedProduct, columns } from './columns';
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

  const toggleNotify = (rowIndex: number) => {
    const updatedData = products.map((row, index) =>
      index === rowIndex ? { ...row, notify: !row.notify } : row
    );
    setProducts(updatedData);
  };

  // initialize the data on component load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/price/${username}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        console.log(data);
        const products = data.data as Product[];
        const temp: TrackedProduct[] = products.map((product: Product) => {
          return {
            url: product.url,
            target_price: product.target_price,
            current_price: product.price,
            notes: product.user_note,
            notify: product.notify,
            toggleNotify: toggleNotify,
            delete: () => {},
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
      <DataTable columns={columns} data={products} />
    </div>
  );
}
