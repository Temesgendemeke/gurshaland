import { getProfilebyUsername } from "@/actions/profile/getProfile";
import { Header } from "@/components/header";
import { Metadata } from "next";
import { Profile } from "@/utils/types/profile";
import BasicInfo from "@/components/profile/BasicInfo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Blog } from "@/utils/types/blog";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s Profile | Gurshaland`,
    description: `View ${username}'s profile on Gurshaland.`,
    openGraph: {
      title: `${username}'s Profile | Gurshaland`,
      description: `View ${username}'s profile on Gurshaland.`,
      url: `https://gurshaland.com/profile/${username}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = (await getProfilebyUsername(username)) as Profile | null;

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-24 pt-10 text-center">
          <h1 className="font-gosh text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Profile not found
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            No user with username &quot;{username}&quot; exists. It may have
            been changed or the link is wrong.
          </p>
          <Button asChild className="mt-8 rounded-full px-6">
            <Link href="/recipes">Browse recipes</Link>
          </Button>
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwn = !!user && user.id === profile.id;

  const blogs: Blog[] = (profile.blogs ?? []).map((b) => ({
    ...b,
    author_id: b.author_id || profile.id,
    contents: [],
    author: {
      id: profile.id,
      full_name: profile.full_name || "",
      username: profile.username,
      avatar: profile.avatar_url || "",
    },
  }));

  return (
    <div className="min-h-screen">
      <Header />

      <header className="border-b border-border/70">
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <BasicInfo profile={profile} />

            <ProfileStats profile={profile} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <ProfileTabs
          profile={profile}
          blogs={blogs}
          isOwn={isOwn}
        />
      </main>
    </div>
  );
}
