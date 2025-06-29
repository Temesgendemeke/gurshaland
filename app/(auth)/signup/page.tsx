"use client"
import { Header } from "@/components/header";
import { signupFormSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import HeroImage from "@/components/HeroImage";
import Link from "next/link";
import EyeButton from "@/components/EyeButton";
import { signup } from "@/actions/auth";
import { toast } from "sonner";
import { SignUpData } from "@/utils/types/account";
import { useRouter } from "next/navigation";




const page = () => {
  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (formData: SignUpData) => {
    try {
      await signup(formData);
      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during sign up. Please try again or contact support if the issue persists."
      );
    }
  };

  return (
    <div className=" bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl h-screen w-screen">
      <Header />

      <div className="flex m-10">
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <h1 className="text-4xl my-6 font-extrabold text-center text-emerald-700">
                Welcome to Gurshaland
              </h1>
              <p className="text-center text-gray-600 mb-4">
                Create your account to get started
              </p>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. abebe"
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
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. aleme kebde"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. abebebeso@test.com"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="password"
                          type={showPassword ? "text" : "password"}
                          className="bg-transparent"
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
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Log in
                </Link>
              </p>
            </form>
          </Form>
        </div>

        <div className="flex-1 hidden lg:block">
          <HeroImage />
        </div>
      </div>
    </div>
  );
};

export default page;
