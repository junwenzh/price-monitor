import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProductDetailsForm } from './ProductDetailsForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function ProductDetails() {
  const location = useLocation();
  const { state } = location;
  const username = useSelector((state: RootState) => state.isLoggedIn.username);
  console.log(username);

  //   const handleUpdate = () => {};
  //   // call the delete api using the username and url

  return (
    <>
      <ProductDetailsForm
        url={state.url}
        currentPrice={state.currentPrice}
        targetPrice={state.targetPrice}
        notes={state.notes}
        notify={state.notify}
      />
    </>
  );
}
