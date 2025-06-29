"use client";
import { changePassword } from "@/actions/auth";
import EyeButton from "@/components/EyeButton";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const page = () => {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (formData: {
    password: string;
    confirm_password: string;
  }) => {
    if (formData.password !== formData.confirm_password) {
      return toast.error("Passwords do not match");
    }

    try {
      await changePassword(formData.password);
      toast.message("Password changed successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");

    if (!access_token || !refresh_token || type !== "recovery") {
      router.replace("/404");
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="mt-20 flex flex-col items-center">
        <h1 className="text-4xl text-emerald-600 font-bold">
          Reset your Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6 max-w-xl">
          Please enter your new password below. Make sure it is strong and
          secure.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/6 space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="enter your email address"
                        className="bg-transparent"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      ></Input>
                      <EyeButton
                        setShowPassword={setShowPassword}
                        showPassword={showPassword}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="enter your email address"
                        className="bg-transparent"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      ></Input>
                      <EyeButton
                        setShowPassword={setShowConfirmPassword}
                        showPassword={showConfirmPassword}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
              aria-disabled={form.formState.isSubmitting}
            >
              Send Reset Link
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
