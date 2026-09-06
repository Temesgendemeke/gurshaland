"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthVisual from "@/components/AuthVisual";
import { z } from "zod";
import { Mail, RotateCw, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: emailFromQuery,
    },
  });

  useEffect(() => {
    if (emailFromQuery) {
      form.setValue("email", emailFromQuery, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [emailFromQuery, form]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendResetEmail = async (email: string) => {
    const supabase = createClient();
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const redirectTo = `${origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      throw error;
    }
  };

  const onSubmit = async (formData: ForgotPasswordFormSchema) => {
    setLoading(true);
    const cleanEmail = formData.email.trim();
    try {
      await sendResetEmail(cleanEmail);
      setSubmittedEmail(cleanEmail);
      setResendCooldown(60);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const message =
        error?.message ||
        error?.error_description ||
        "Failed to send password reset email. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.warn("Forgot password validation errors:", errors);
    const message =
      errors?.email?.message || "Please provide a valid email address.";
    toast.error(message);
  };

  const handleResend = async () => {
    if (!submittedEmail || resendCooldown > 0 || resending) return;
    setResending(true);
    try {
      await sendResetEmail(submittedEmail);
      setResendCooldown(60);
      toast.success("Reset link resent! Please check your inbox.");
    } catch (error: any) {
      console.error("Resend reset error:", error);
      const message =
        error?.message ||
        error?.error_description ||
        "Failed to resend password reset email. Please try again.";
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 sm:space-y-8 sm:p-8 md:p-10 rounded-lg max-w-2xl lg:mr-0 lg:my-auto">
      <div className="relative z-10 hidden sm:flex items-center justify-between w-full lg:hidden">
        <Logo />
      </div>

      {submittedEmail ? (
        /* Check Your Email State */
        <div className="space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary">
            <Mail className="h-8 w-8" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-[clamp(1.75rem,1.5rem+1.5vw,3rem)] font-bold tracking-tight text-foreground font-gosh">
              Check your email
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-foreground break-all">
                {submittedEmail}
              </span>
              .
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">
              Click the link inside to set a new password. If you don&apos;t
              see it in your inbox, please check your spam or junk folder.
            </p>
          </div>

          <div className="w-full pt-2 space-y-3">
            <Button
              type="button"
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
              variant="outline"
              className="w-full h-12 rounded-xl text-base font-semibold border-2 transition-colors duration-200"
            >
              {resending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Resending...
                </span>
              ) : resendCooldown > 0 ? (
                `Resend link in ${resendCooldown}s`
              ) : (
                <span className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Resend reset link
                </span>
              )}
            </Button>

            <Button
              type="button"
              onClick={() => {
                setSubmittedEmail(null);
                form.reset({ email: submittedEmail });
              }}
              variant="ghost"
              className="w-full h-12 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Use a different email address
            </Button>

            <div className="pt-2 text-center sm:text-left">
              <Link
                href="/login"
                className="text-sm font-semibold text-primary hover:text-primary/90 transition-colors inline-flex items-center gap-1.5"
              >
                Return to log in
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Input Form State */
        <>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
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
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit, onInvalid)(e);
                }}
                noValidate
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
                  className="w-full h-12 rounded-xl text-base font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 mt-2"
                  disabled={loading}
                >
                  {loading ? (
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
        </>
      )}
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-viewport w-full grid lg:h-screen lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
      {/* Left Side - Visuals */}
      <AuthVisual />

      {/* Right Side - Form or Success State */}
      <div className="flex flex-col relative z-10 lg:min-h-0 lg:overflow-y-auto">
        <Suspense fallback={null}>
          <ForgotPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
