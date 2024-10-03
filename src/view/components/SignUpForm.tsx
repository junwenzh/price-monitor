import { zodResolver } from '@hookform/resolvers/zod';
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
type ResponseError = {
  message: string;
};
const formSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().min(5),
  password: z.string().min(4).max(20),
});

export default function SignUpForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const { username, email, password } = values;

    try {
      const response = await fetch(`/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log(response);

      if (response.ok) {
        dispatch(logIn({ username }));
        navigate('/');
      } else {
        const error: ResponseError = await response.json();
        console.error(error.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="email"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 space-y-0">
              <FormLabel className="col-span-1 text-right pr-4 mt-2">
                Email
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
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
}
