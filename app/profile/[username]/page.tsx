import { getProfilebyUsername } from "@/actions/profile/profile";
import { Header } from "@/components/header";
import RecipeCard from "@/components/recipe/RecipeCard";
import { Profile } from "@/utils/types/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Metadata } from "next";
import BasIcInfo from "@/components/profile/BasicInfo";

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
  const profile: Profile = await getProfilebyUsername(username);

  const info_list = [
    { field: "following", count: profile.following.length },
    { field: "follower", count: profile.followers },
    { field: "posts", count: profile.recipes.length },
  ];

  return (
    <div>
      <Header />

      <div className="flex flex-col items-center mt-8">
        <BasIcInfo profile={profile} />
        <div className="flex justify-center gap-8 mt-6">
          {info_list.map((info, index) => (
            <div className="flex flex-col items-center" key={index}>
              <span className="text-lg font-bold text-primary">
                {info.count}
              </span>
              <span className="text-sm text-gray-500">{info.field}</span>
            </div>
          ))}
        </div>
        <Tabs defaultValue="recipes" className="w-full max-w-7xl ">
          <TabsList className="flex items-center gap-6    rounded-xl p-2 ">
            <TabsTrigger
              value="recipes"
              className="px-6 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary-dark transition-all duration-200 shadow-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl"
            >
              Recipes
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="px-6 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary-dark transition-all duration-200 shadow-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl"
            >
              Blogs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recipes">
            <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-7xl mx-4">
              {profile.recipes.length ? (
                profile.recipes.map((recipe, index) => (
                  <RecipeCard
                    recipe={{
                      ...recipe,
                      slug: `${recipe.slug}?from=profile/${profile.username}`,
                      author: {
                        username: profile.username,
                        full_name: profile.full_name,
                        avatar_url: profile.avatar_url,
                        bio: profile.bio || "",
                        recipes: Array.isArray(profile.recipes)
                          ? profile.recipes.length
                          : 0,
                      },
                    }}
                    key={index}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-3">
                  No recipes found.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="blogs"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
