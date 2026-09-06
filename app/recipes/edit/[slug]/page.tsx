import { getRecipebySlug, getRecipebySlugAdmin } from "@/actions/Recipe/recipe";
import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";
import { createClient } from "@/utils/supabase/server";

async function EditRecipe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let recipe: any = null;

  try {
    recipe = await getRecipebySlugAdmin(slug);
  } catch (e) {
    console.error("Failed getRecipebySlugAdmin:", e);
  }

  if (!recipe) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      recipe = await getRecipebySlug(slug, user?.id);
    } catch (e) {
      console.error("Failed getRecipebySlug fallback:", e);
    }
  }

  if (!recipe) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
            <p className="text-muted-foreground">
              The recipe you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className=" px-4 py-10 sm:px-6 lg:px-8">
        <div className="mt-6 space-y-3 text-center flex flex-col items-center justify-center">
          <h1 className="font-gosh text-3xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Refine your recipe
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Update your recipe and keep Ethiopian culinary traditions alive.
          </p>
        </div>
        <div className="mt-10">
          <SubmitRecipeForm recipe={recipe} mode="update" />
        </div>
      </div>
    </>
  );
}

export default EditRecipe;
