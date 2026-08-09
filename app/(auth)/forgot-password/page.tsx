"use client";
import { resetPassword } from "@/actions/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthVisual from "@/components/AuthVisual";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import GoBackNoText from "@/components/GoBackNoText";

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>;

const Page = () => {
  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (formData: { email: string }) => {
    try {
      await resetPassword(formData.email);
      toast.success("Password reset email sent. Please check your inbox.");
      router.push("/login");
    } catch (error) {
      toast.error(
        "Failed to send password reset email. Please try again or contact support if the issue persists.",
      );
    }
  };

  return (
    <div className="min-h-viewport w-full grid lg:h-screen lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
      {/* Left Side - Visuals */}
      <AuthVisual />

      <GoBackNoText />

      {/* Right Side - Form */}
      <div className="flex flex-col relative z-10 lg:min-h-0 lg:overflow-y-auto">
        <div className="w-full mx-auto space-y-6 sm:space-y-8 sm:p-8 md:p-10 rounded-lg max-w-2xl lg:mr-0 lg:my-auto">
          <div className="relative z-10 hidden sm:flex items-center justify-between w-full lg:hidden">
            <Logo />
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md bg-muted hover:bg-muted/70 border border-border transition-colors duration-200 text-xs sm:text-sm font-medium text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
          <div className=" flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-[clamp(1.75rem,1.5rem+1.5vw,3rem)] font-bold tracking-tight text-foreground font-gosh">
              Forgot password?
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your email address to receive a password reset link.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/90 font-semibold transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          className="h-12 rounded-xl bg-background border-2 border-muted focus:border-primary focus:ring-0 transition-colors duration-200 text-base px-4 placeholder:text-muted-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm font-medium pl-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 shadow-sm mt-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
