import { Header } from "@/components/header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/profile/ProfileSettings";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full  px-4 pb-24 pt-10 sm:px-6">
        <div className="mb-8">
          <h1 className="font-gosh text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account preferences, profile, and security settings.
          </p>
        </div>
        <ProfileSettings />
      </main>
    </div>
  );
}
