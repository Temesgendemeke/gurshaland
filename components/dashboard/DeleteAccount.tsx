"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
} from "../ui/alert-dialog";
import { Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/actions/profile/profile";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";

interface DeleteAccountProps {
  profile_id: string;
}

const DeleteAccount = ({ profile_id }: DeleteAccountProps) => {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    // call action function here
    try {
      await deleteAccount(profile_id);
      router.push("/login");
    } catch (error) {
      toast.error(generate_error(error));
    }
  };
  return (
    <Card className="border border-error/20 bg-card shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-error text-xl font-bold">
          <span className="inline-flex items-center justify-center bg-error/10 rounded-full p-2">
            <Shield className="h-6 w-6 text-error" />
          </span>
          Delete Account
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
              you delete your account,{" "}
              <span className="font-medium text-foreground">all your data</span>{" "}
              including recipes, blogs, and profile information will be{" "}
              <span className="underline decoration-error underline-offset-2">
                permanently removed
              </span>
              . Please be absolutely certain before proceeding.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="px-8 py-2 rounded-full font-semibold text-base shadow-sm"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border border-error/20 shadow-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-error text-lg font-bold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-error" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground mt-2">
                  This action{" "}
                  <span className="font-semibold text-error">
                    cannot be undone
                  </span>
                  . Your account and all data will be{" "}
                  <span className="font-semibold">permanently deleted</span>{" "}
                  from our servers. You will lose access to all your content and
                  settings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row gap-3 mt-4">
                <AlertDialogCancel className="rounded-full px-6 py-2 border border-muted-foreground/20 hover:bg-muted-foreground/10 transition">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-error hover:bg-error/90 text-white px-8 py-2 rounded-full font-semibold shadow transition focus:ring-2 focus:ring-error/30 focus:ring-offset-2"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete My Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeleteAccount;
