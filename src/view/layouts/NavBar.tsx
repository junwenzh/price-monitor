import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { logIn, logOut } from '../slices/loggedInSlice';
import { RootState } from '../store';
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const isLoggedIn = useSelector(
    (state: RootState) => state.isLoggedIn.isLoggedIn
  );
  const loggedInUser = useSelector(
    (state: RootState) => state.isLoggedIn.username
  );
  // console.log(loggedInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    navigate('/');
    dispatch(logOut());
  };

  // const handleLogIn = () => {
  //   dispatch(logIn({ username: 'hi', email: 'email' }));
  // };

  const LoggedInUI = () => (
    <div>
      <p>Welcome, {loggedInUser}!</p>
      <Link to="/trackinghistory">Price Tracking History</Link>
      <Link to="/newproducttracker">New Product Price Tracker</Link>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
  const LoggedOutUI = () => (
    <div>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      {/* <button onClick={handleLogIn}>Login</button> */}
    </div>
  );

  const testCookie = () => {
    fetch('/test-cookie');
  };

  return (
    <div>
      <nav className="flex">{isLoggedIn ? LoggedInUI() : LoggedOutUI()}</nav>
      <button onClick={testCookie}>test cookie</button>
    </div>
  );
}
