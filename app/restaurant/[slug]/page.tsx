import { getRestaurantBySlug } from "@/actions/restaurant/crud";

export default async function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const restaurant = await getRestaurantBySlug(slug);
  return <div>{restaurant?.name}</div>;
}
