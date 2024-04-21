import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

export default function TrackingHistory() {
  const navigate = useNavigate();
  const username = useSelector((state: RootState) => state.isLoggedIn.username);
  console.log(username);

  const handleFetchProductInfo = async () => {
    try {
      const response = await fetch(`/api/price/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          //token authorization headers?
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Product Info:', data);
    } catch (error) {
      console.error('Error fetching product info:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFetchProductInfo}>Fetch Product Info</button>
    </div>
  );
}
