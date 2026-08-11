import { Header } from "@/components/header";
import { getRestaurantBySlug } from "@/actions/restaurant/crud";
import EditRestaurantForm from "@/components/restaurant/EditRestaurantForm";
import { notFound } from "next/navigation";

const EditRestaurantPage = async ({ slug }: { slug: string }) => {
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="mt-10 mb-2 text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Refine Your Spot
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
        <h1 className="mt-4 font-gosh text-4xl font-extrabold tracking-tight md:text-5xl">
          Edit <span className="text-primary">Restaurant</span>
        </h1>
        <div className="mx-auto flex h-1 w-24 gap-1.5 pt-2">
          <span className="flex-1 rounded-full bg-ethiopian-green" />
          <span className="flex-1 rounded-full bg-ethiopian-yellow" />
          <span className="flex-1 rounded-full bg-ethiopian-red" />
        </div>
      </div>
      <EditRestaurantForm restaurant={restaurant} />
    </div>
  );
};

export default EditRestaurantPage;
