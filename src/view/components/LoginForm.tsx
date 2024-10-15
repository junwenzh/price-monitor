import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { logIn } from '../slices/loggedInSlice';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(4).max(20),
});

export function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // const data = await response.json();
        const username = Cookies.get('username');
        const token = Cookies.get('token');
        localStorage.setItem(
          'token',
          JSON.stringify({
            value: token,
            expiry: new Date().getTime() + 3600,
          })
        );
        localStorage.setItem(
          'userDetails',
          JSON.stringify({
            username: username,
            //            email: data.email,
          })
        );
        dispatch(logIn({ username: username }));
        navigate('/trackinghistory');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 space-y-0">
              <FormLabel className="col-span-1 text-right pr-4 mt-2">
                Username
              </FormLabel>
              <FormControl className="col-span-3">
                <Input {...field} className="w-60" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 space-y-0">
              <FormLabel className="col-span-1 text-right pr-4 mt-2">
                Password
              </FormLabel>
              <FormControl className="col-span-3">
                <Input type="password" {...field} className="w-60" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" className="w-full my-8">
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}
