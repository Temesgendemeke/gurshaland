import { Header } from "@/components/header";
import { getRestaurantBySlug } from "@/actions/restaurant/crud";
import EditRestaurantForm from "@/components/restaurant/EditRestaurantForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconChevronRight, IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const EditRestaurantPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-10">
        {/* Breadcrumb & Top Bar */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-3 sm:mb-4">
          <Link
            href="/restaurant"
            className="hover:text-foreground transition-colors"
          >
            Restaurants
          </Link>
          <IconChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
          <Link
            href={`/restaurant/${restaurant.slug}`}
            className="hover:text-foreground transition-colors font-medium truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[260px]"
          >
            {restaurant.name}
          </Link>
          <IconChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
          <span className="text-foreground font-medium shrink-0">Edit</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border/60">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground">
              Edit Restaurant Profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Update details, signature menu items, location, and photo gallery
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button asChild variant="outline" size="sm" className="gap-1.5 h-8 sm:h-9 text-xs sm:text-sm">
              <Link
                href={`/restaurant/${restaurant.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Public Page</span>
                <IconExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="pt-4 sm:pt-6">
          <EditRestaurantForm restaurant={restaurant} />
        </div>
      </main>
    </div>
  );
};

export default EditRestaurantPage;
