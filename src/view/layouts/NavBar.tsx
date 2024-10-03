import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../slices/loggedInSlice';
import { RootState } from '../store';

import { Button } from '../components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../components/ui/navigation-menu';

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

  return (
    <header className="fixed top-0 w-full py-4 z-50">
      <nav className="container w-full grid grid-cols-3 items-center gap-4 px-4 ">
        <div className="flex justify-start w-full">
          <a href="/">LOGO</a>
        </div>

        <div className="flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex">
              <NavigationMenuItem>
                <Button variant="outline" className="w-40">
                  <Link to="/trackinghistory">Your Products</Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="outline" className="w-40">
                  <Link to="/newproduct">Track New Product</Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex justify-end">
          {isLoggedIn ? (
            <NavigationMenu>
              <NavigationMenuList className="flex">
                <NavigationMenuItem>Welcome {loggedInUser}</NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="outline" onClick={handleLogOut}>
                    Log Out
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <NavigationMenu>
              <NavigationMenuList className="flex">
                <NavigationMenuItem>
                  <Button variant="outline" className="w-32">
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="outline" className="w-32">
                    <Link to="login">Sign In</Link>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
      </nav>
    </header>
  );
}
