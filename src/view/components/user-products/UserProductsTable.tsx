import React, { useEffect, useState } from 'react';
import { TrackedProduct, columns } from './columns';
import { DataTable } from '../ui/datatable';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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
  // const username = useSelector((state: RootState) => state.isLoggedIn.username);
  const username = 'jun';
  //console.log(username);
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [error, setError] = useState<string>('');

  // price, target_price, user_note, url

  // on component load, we fetch all the user products from the database
  // pass this data to the datatable
  // goal: make notify updatable

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/price/${username}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        console.log(data);
        const products = data.data as Product[];
        const temp: TrackedProduct[] = products.map(
          (index, product: Product) => {
            return {
              url: product.url,
              target_price: product.target_price,
              current_price: product.price,
              notes: product.user_note,
              notify: product.notify,
              delete: () => {},
            };
          }
        );
        setProducts(temp);
        // const product: TrackedProduct = {
        //   url: data.url,
        //   target_price: data.target_price,
        //   current_price: data.price,
        //   notes: data.user_note,
        //   notify: false,
        //   delete: () => {},
        // };
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const updateNotify = () => {
    //locally update notify state
    //send to backend
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={products} />
    </div>
  );
}
