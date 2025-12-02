import { getRecipebySlugAdmin } from "@/actions/Recipe/recipe";
import BackNavigation from "@/components/BackNavigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";

async function EditRecipe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipebySlugAdmin(slug);

  if (!recipe) {
    return (
      <>
        <Header />
        <div className="mx-auto px-10 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300">
              The recipe you're looking for doesn't exist.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mx-auto px-10 py-12 space-y-8">
        <BackNavigation />
        <div className="text-center ">
          <h1 className="text-6xl font-bold mb-4">
            <span className="">Edit Your Recipe</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Update and refine your Ethiopian culinary masterpiece below.
          </p>
        </div>
        <div>
          {JSON.stringify(recipe)}
          <h1>from main edit</h1>
          <SubmitRecipeForm recipe={recipe} mode="update" />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditRecipe;
