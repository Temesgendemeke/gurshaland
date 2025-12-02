import { Header } from "@/components/header";
import { getRestaurantBySlug } from "@/actions/restaurant/crud";
import EditRestaurantForm from "@/components/restaurant/EditRestaurantForm";
import { GetRestaurentType } from "@/schema/restaurent";
import { notFound } from "next/navigation";

const EditRestaurantPage = async ({ slug }: { slug: string }) => {
  const restaurant = await getRestaurantBySlug(slug);

  if(!restaurant) {
    return notFound();
  }

  return (
    <div>
      <Header/>
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-10">Edit Restaurant</h1>
      {/* Add your edit form here */}
      <div>
        <EditRestaurantForm restaurant={restaurant}/>
      </div>
    </div>
  );
};

export default EditRestaurantPage;
