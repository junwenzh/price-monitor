import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
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
import { RootState } from '../store';
import { useToast } from './ui/use-toast';
import Container from './ui/container';

const formSchema = z.object({
  password: z.string(),
  email: z.string(),
});

export default function UserSettings() {
  const username = useSelector((state: RootState) => state.isLoggedIn.username);
  // const [email, setEmail] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  });

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(res => res.json())
      .then(data => {
        // setEmail(data.email);
        form.reset({ email: data.email });
        console.log(data);
      });
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { password, email } = values;

    try {
      const response = await fetch('/api/users/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        toast({
          title: 'Updated user',
        });
      } else {
        console.error('Update failed');
        toast({
          title: 'Update failed',
        });
      }
    } catch (error) {
      console.error('Error updating the user:', error);
      toast({
        title: 'Update failed',
      });
    }
  }

  return (
    <Container>
      <h2 className="text-2xl mb-10">Update Your User Log-In Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  );
}
