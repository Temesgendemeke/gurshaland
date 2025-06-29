"use client";
import { resetPassword } from "@/actions/auth";
import { Header } from "@/components/header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const page = () => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (formData: { email: string }) => {
    try {
      resetPassword(formData.email);
      toast.success("Password reset email sent. Please check your inbox.");
      return router.push("/login");
    } catch (error) {
      toast.error(
        "Failed to send password reset email. Please try again or contact support if the issue persists."
      );
    }
  };

  return (
    <div>
      <Header />

      <div className="mt-20 w-full flex justify-center items-center flex-col">
        <h1 className="text-emerald-600 text-4xl font-bold">
          Forgout password?
        </h1>
        <p className="mb-4 text-gray-600">
          Enter your email address to receive a password reset link.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/6 space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your email address"
                      className="bg-transparent"
                      {...field}
                    ></Input>
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
