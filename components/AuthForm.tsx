'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import FormField from '@/components/FormField';
import { useRouter } from 'next/navigation';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8).max(18),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        toast.success('Account created successfully. Please sign in.');
        router.push('/sign-in');
      } else {
        toast.success('Sign In successfully.');
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error} `);
    }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="./logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepViva</h2>
        </div>

        <h3>Practice jobs interview with AI.</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email"
            />

            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Your Password"
                type={showPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                className="absolute inset-y-0 mt-6 mr-1 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            <Button className="btn" type="submit">
              {isSignIn ? 'Sign In' : 'Create an account.'}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? 'No account yet?' : 'Have an account already?'}
          <Link
            href={!isSignIn ? '/sign-in' : '/sign-up'}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? 'Sign In' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
