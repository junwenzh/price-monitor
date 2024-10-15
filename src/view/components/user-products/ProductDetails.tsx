import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProductDetailsForm } from './ProductDetailsForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';

export default function ProductDetails() {
  const location = useLocation();
  const { state } = location;
  const username = useSelector((state: RootState) => state.isLoggedIn.username);
  console.log(username, `username`);
  console.log(state);

  //   const handleUpdate = () => {};
  //   // call the delete api using the username and url

  return (
    <div>
      <Card className="space-y-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Product Details</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p>Item Name:</p>
            <p>{state.title}</p>
          </div>
          <div>
            <p>Current Price: </p>
            <p>{state.current_price}</p>
          </div>
        </CardContent>
        <CardContent>
          <ProductDetailsForm
            url={state.url}
            title={state.title}
            currentPrice={state.current_price}
            targetPrice={state.target_price}
            notes={state.notes}
            notify={state.notify}
          />
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full"></div>
        </CardFooter>
      </Card>
    </div>
  );
}
