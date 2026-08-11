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
import Reveal from "@/components/Reveal";

export default async function HomePage() {
  const categories = await getCategories();
  return (
    <div className="relative z-10">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16 sm:space-y-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Explore Categories */}
        <div>
          <SectionText
            header="Explore Categories"
            description="Stews, flatbreads, and street food from every region"
            seeMoreLink="/categories"
          />
          <div className="flex gap-6 overflow-hidden relative w-full flex-col items-center justify-center">
            <Marquee pauseOnHover className="[--duration:30s]">
              {categories.map((category: any) => (
                <Link
                  href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}?id=${category.id}`}
                  key={category.id}
                  className="flex flex-col items-center shrink-0 hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-25 h-25 sm:w-40 sm:h-40 rounded-full overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-xs sm:text-sm sm:font-medium mt-1.5">
                    {category.name}
                  </h2>
                </Link>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 xl:w-1/4 bg-linear-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 xl:w-1/4 bg-linear-to-l from-background"></div>
          </div>
        </div>

        {/* Featured Content */}
        <section>
          <FeaturedCards />
        </section>

        {/* Features */}
        <section>
          <Reveal>
            <div className="mb-10">
              <h2 className="heading-primary mb-3 text-2xl font-bold sm:text-3xl">
                Why Gurshaland?
              </h2>
              <p className="text-body text-lg">
                Recipes worth gathering around the mesob for
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {why_gurshaland.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <WhyCard
                  title={item.title}
                  description={item.description}
                  icon={<item.icon className="w-8 h-8 text-primary" />}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <Reveal>
          <Card className="relative overflow-hidden border-border bg-card p-10 text-center text-foreground sm:p-14">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Gursha · ጉርሻ
              </p>
              <h2 className="heading-primary mb-4 text-3xl font-bold sm:text-4xl">
                Pull up a chair.
              </h2>
              <p className="mb-8 text-lg text-body">
                In Amharic, gursha is feeding a loved one with your own hands.
                Save recipes, share your own, and eat together.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-modern px-8"
                >
                  <Link href="/recipes">Explore Recipes</Link>
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
        </Reveal>

        {/* Footer is rendered globally in RootLayout */}
      </div>
    </div>
  );
}
