"use client";
import { changePassword } from "@/actions/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPasswordSchema } from "@/utils/schema";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthVisual from "@/components/AuthVisual";
import { ArrowLeft } from "lucide-react";
import GoBackNoText from "@/components/GoBackNoText";
import PasswordField from "@/components/PasswordField";
import { z } from "zod";

export type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;

const INVALID_LINK_MESSAGE =
  "This reset link is invalid or has expired. Please request a new one.";

const Page = () => {
  const form = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  const router = useRouter();
  const [linkError, setLinkError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const onSubmit = async (formData: ResetPasswordFormSchema) => {
    if (formData.password !== formData.confirm_password) {
      return toast.error("Passwords do not match");
    }

    try {
      await changePassword(formData.password);
      toast.success(
        "Password changed successfully. Please log in with your new password.",
      );
      router.push("/login");
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Failed to change password. Please try again.");
    }
  };

  useEffect(() => {
    const supabase = createClient();
    let disposed = false;

    const params = new URLSearchParams(window.location.search);
    const urlError = params.get("error");
    const urlErrorDescription = params.get("error_description");
    const hadCode = params.has("code");

    const showForm = () => {
      if (disposed) return;
      setReady(true);
      if (window.location.search || window.location.hash) {
        window.history.replaceState({}, "", "/reset-password");
      }
    };

    const fail = (message: string) => {
      if (disposed) return;
      setLinkError(message);
    };

    if (urlError) {
      queueMicrotask(() =>
        fail(
          urlErrorDescription
            ? decodeURIComponent(urlErrorDescription)
            : INVALID_LINK_MESSAGE,
        ),
      );
      return;
    }

    const { data: subscriptionData } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) showForm();
      },
    );

    // The browser client from @supabase/ssr is a singleton with
    // detectSessionInUrl = true, so it auto-detects the recovery `code`
    // in the URL and exchanges it exactly once during initialization.
    // Do NOT call exchangeCodeForSession() manually here  a second
    // exchange fails with "invalid or expired" and races the auth-token
    // lock ("Lock ... was released because another request stole it").
    supabase.auth.getSession().then(({ data }) => {
      if (disposed) return;
      if (data.session) {
        showForm();
      } else if (hadCode) {
        fail(INVALID_LINK_MESSAGE);
      } else {
        router.replace("/forgot-password");
      }
    });

    return () => {
      disposed = true;
      subscriptionData.subscription.unsubscribe();
    };
  }, [router]);

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
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-[clamp(1.75rem,1.5rem+1.5vw,3rem)] font-bold tracking-tight text-foreground font-gosh">
              Set a new password
            </h1>
            <p className="text-sm sm:text-base  text-muted-foreground mt-1.5">
              Enter a new password for your account below.
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

          {linkError ? (
            <div className="w-full rounded-xl border border-error/30 bg-error/10 p-6 text-center">
              <p className="text-error font-semibold text-lg">
                Reset link invalid or expired
              </p>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {linkError}
              </p>
              <Button asChild className="mt-6">
                <Link href="/forgot-password">Request a new link</Link>
              </Button>
            </div>
          ) : ready ? (
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <PasswordField
                            placeholder="Enter a new password"
                            className="h-12 rounded-xl bg-background border-2 border-muted focus:border-primary focus:ring-0 transition-colors duration-200 text-base px-4 placeholder:text-muted-foreground/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm font-medium pl-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-foreground text-sm sm:text-base font-semibold">
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <PasswordField
                            placeholder="Confirm your new password"
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
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="w-full max-w-md flex items-center justify-center py-16">
              <span className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
