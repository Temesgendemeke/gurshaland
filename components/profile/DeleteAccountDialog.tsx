"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Shield } from "lucide-react";
import { deleteAccount } from "@/actions/profile/profile";
import generate_error from "@/utils/generate_error";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export function DangerZoneSection() {
  const user = useAuth((store) => store.user);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user?.id) return;
    try {
      setDeleting(true);
      await deleteAccount(user.id);
      toast.success("Account deleted successfully");
      router.push("/login");
    } catch (error) {
      toast.error(generate_error(error));
      setDeleting(false);
    }
  };

  return (
    <Card className="border border-error/30 bg-card shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-error text-lg font-bold">
          <span className="inline-flex items-center justify-center bg-error/10 rounded-full p-2">
            <Shield className="h-5 w-5 text-error" />
          </span>
          Danger Zone
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Permanently delete your account and all associated data.{" "}
          <span className="font-semibold text-foreground">
            This action cannot be undone.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-md">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-error">Warning:</span> Once
              you delete your account, all recipes, meal plans, blogs, and profile
              data will be{" "}
              <span className="underline decoration-error underline-offset-2">
                permanently removed
              </span>
              .
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="px-6 font-semibold shadow-none shrink-0"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-error/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-error text-lg font-bold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-error" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground mt-2">
                  This action{" "}
                  <span className="font-semibold text-error">cannot be undone</span>.
                  Your account and all associated content will be permanently removed
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-3 mt-4">
                <AlertDialogCancel className="px-5 shadow-none">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 font-semibold shadow-none"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
