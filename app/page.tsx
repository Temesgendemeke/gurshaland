import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FeaturedCards } from "@/components/featured-cards";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import WhyCard from "@/components/WhyCard";
import why_gurshaland from "@/constants/homepage";
import { getCategories } from "@/actions/Recipe/category";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import SectionText from "@/components/SectionText";

export default async function HomePage() {
  const categories = await getCategories();
  return (
    <div className="relative z-10 container mx-auto px-6 sm:px-12 space-y-10 ">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      <div className="">
        <SectionText
          header="Explore Categories"
          description="Discover our wide range of delicious Ethiopian dishes"
          seeMoreLink="/categories"
        />
        <div className="flex gap-6  overflow-hidden relative  w-full flex-col items-center justify-center ">
          <Marquee pauseOnHover className="[--duration:30s]">
            {categories.map((category: any) => (
              <Link
                href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}?id=${category.id}`}
                key={category.id}
                className="flex flex-col items-center shrink-0  hover:scale-105 transition-transform duration-300"
              >
                <div className="w-25 h-25 sm:w-40 sm:h-40 rounded-full overflow-hidden ">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xs  sm:text-sm sm:font-medium mt-1.5">
                  {category.name}
                </h2>
              </Link>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 xl:w-1/4  bg-linear-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 xl:w-1/4 bg-linear-to-l from-background"></div>
        </div>
      </div>

      {/* Featured Content */}
      <section className="">
        <div className="max-w-7xl mx-auto">
          <FeaturedCards />
        </div>
      </section>

      {/* Features */}
      <section className="">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold heading-primary mb-3">
              Why Choose Gurshaland?
            </h2>
            <p className="text-lg text-body">
              Your gateway to authentic Ethiopian cuisine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {why_gurshaland.map((item) => (
              <WhyCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={<item.icon className="w-8 h-8 text-primary-foreground " />}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Card className="p-10 text-center bg-card border border-border text-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of food lovers discovering the magic of Ethiopian
            cuisine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary-modern px-8">
              <Link href="/recipes">Browse Recipes</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 text-primary"
            >
              <Link href="/recipes/create">Share Your Recipe</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Footer is rendered globally in RootLayout */}
    </div>
  );
}
