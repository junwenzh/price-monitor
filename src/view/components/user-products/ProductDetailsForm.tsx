import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { logIn } from '../../slices/loggedInSlice';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';

const formSchema = z.object({
  targetPrice: z.number(),
  notes: z.string().max(1000),
  notify: z.boolean(),
});

type ProductDetailsFormProps = {
  url: string;
  targetPrice: number;
  currentPrice: number;
  notes: string;
  notify: boolean;
};

export function ProductDetailsForm({
  url,
  targetPrice,
  currentPrice,
  notes,
  notify,
}: ProductDetailsFormProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetPrice: targetPrice,
      notes: notes,
      notify: notify,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // const { username, password } = values;

    // try {
    //   const response = await fetch('/api/users/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   if (response.ok) {
    //     // const data = await response.json();
    //     const username = Cookies.get('username');
    //     const token = Cookies.get('token');
    //     localStorage.setItem(
    //       'token',
    //       JSON.stringify({
    //         value: token,
    //         expiry: new Date().getTime() + 3600,
    //       })
    //     );
    //     localStorage.setItem(
    //       'userDetails',
    //       JSON.stringify({
    //         username: username,
    //         //            email: data.email,
    //       })
    //     );
    //     dispatch(logIn({ username: username }));
    //     navigate('/');
    //   } else {
    //     console.error('Login failed');
    //   }
    // } catch (error) {
    //   console.error('Error during login:', error);
    // }
  }
  //   const handleDelete = async (url: string) => {
  //     try {
  //       const response = await fetch(`api/${username}/${url}/delete`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ url }),
  //       });
  //     } catch (error) {
  //       console.error('Error deleting tracked product', error);
  //     }
  //   };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="targetPrice"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 space-y-0">
              <FormLabel className="col-span-1 text-right pr-4 mt-2">
                Target Price
              </FormLabel>
              <FormControl className="col-span-3">
                <Input type="number" {...field} className="w-60" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 space-y-0">
              <FormLabel className="col-span-1 text-right pr-4 mt-2">
                Notes
              </FormLabel>
              <FormControl className="col-span-3">
                <Input type="text" {...field} className="w-60" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notify"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 gap-4 space-y-0">
              <FormLabel className="col-span-1 text-right pr-4 mt-2">
                Notify
              </FormLabel>
              <FormControl className="col-span-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" className="w-full my-8">
            Save
          </Button>
          <Button className="w-full my-8">Delete</Button>
        </div>
      </form>
    </Form>
  );
}
