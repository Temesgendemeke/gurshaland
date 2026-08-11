"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/utils/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";
import EyeButton from "@/components/EyeButton";
import { useAuth } from "@/store/useAuth";

type PasswordFieldName =
  | "current_password"
  | "new_password"
  | "confirm_password";

type FormValues = z.infer<typeof changePasswordSchema>;

function PasswordField({
  name,
  label,
  placeholder,
  control,
}: {
  name: PasswordFieldName;
  label: string;
  placeholder: string;
  control: Control<FormValues>;
}) {
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-sm font-medium text-foreground">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                className="h-12 pr-12 text-base"
                {...field}
              />
              <EyeButton showPassword={show} setShowPassword={setShow} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function Page() {
  const router = useRouter();
  const user = useAuth((store) => store.user);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Verify the current password before allowing a change
      if (user?.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: data.current_password,
        });
        if (verifyError) throw verifyError;
      }

      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) throw error;

      toast.success("Password Updated", {
        description: "Your password has been changed successfully.",
      });
      form.reset();
      router.push("/dashboard/settings");
    } catch (error) {
      const message = generate_error(error);
      const authError = error as { code?: string } | null;
      const isInvalidCredentials =
        authError?.code === "invalid_credentials" ||
        /invalid login credentials/i.test(message);

      toast.error("Update Failed", {
        description: isInvalidCredentials
          ? "Your current password is incorrect. Please try again."
          : message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Change Password
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <PasswordField
                name="current_password"
                label="Current Password"
                placeholder="Enter your current password"
                control={form.control}
              />
              <PasswordField
                name="new_password"
                label="New Password"
                placeholder="Enter your new password"
                control={form.control}
              />
              <PasswordField
                name="confirm_password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                control={form.control}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 btn-primary-modern text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>Update Password</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
