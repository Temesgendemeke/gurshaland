import { getRecipebySlugAdmin } from "@/actions/Recipe/recipe";
import BackNavigation from "@/components/BackNavigation";
import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";

async function EditRecipe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipebySlugAdmin(slug);

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
      <div className="mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-8">
        <BackNavigation />
        <div className="text-center ">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="">Edit Your Recipe</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Update and refine your Ethiopian culinary masterpiece below.
          </p>
        </div>
        <div>
          <SubmitRecipeForm recipe={recipe} mode="update" />
        </div>
      </div>
    </>
  );
}

export default EditRecipe;
