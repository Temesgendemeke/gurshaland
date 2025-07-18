"use client";
import { Header } from "@/components/header";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/utils/schema";
import HeroImage from "@/components/HeroImage";
import Link from "next/link";
import { login } from "@/actions/auth";
import EyeButton from "@/components/EyeButton";
import { useRouter } from "next/navigation";


export type LoginFormSchema = z.infer<typeof loginFormSchema>;

const Page = () => {
  const form = useForm({
    resolver: zodResolver<LoginFormSchema>(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (formData: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("You have successfully logged in. እንኳን ደህና መጡ።");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while logging in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex m-10">
        <HeroImage />
        <div className="flex-1 mt-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6 mx-auto"
            >
              <h1 className="text-5xl my-5 font-bold text-center text-emerald-600">
                Welcome back
              </h1>
              <p className="text-center text-gray-500">Login with</p>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        className="bg-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="enter your password"
                          type={showPassword ? "text" : "password"}
                          className="bg-transparent w-full h-full"
                          {...field}
                        />
                        <EyeButton
                          showPassword={showPassword}
                          setShowPassword={setShowPassword}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link href={"/forgot-password"} className="block text-sm">forgot password?</Link>
              <Button
                type="submit"
                className="w-full lg:w-40"
                disabled={form.formState.isSubmitting || loading}
                aria-disabled={form.formState.isSubmitting || loading}
              >
                Login
              </Button>
              <p className="text-center text-sm text-gray-500">
                New user?{" "}
                <Link
                  href="/signup"
                  className="text-emerald-600 hover:underline font-bold"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
