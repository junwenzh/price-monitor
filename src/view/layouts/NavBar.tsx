import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../slices/loggedInSlice';
import { RootState } from '../store';

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

  return (
    <div>
      <nav className="flex">{isLoggedIn ? LoggedInUI() : LoggedOutUI()}</nav>
    </div>
  );
}
