import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { FeaturedCards } from "@/components/featured-cards";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import WhyCard from "@/components/WhyCard";
import why_gurshaland from "@/constants/homepage";
import { getCategories } from "@/actions/Recipe/category";
import Image from "next/image";
import { Marquee } from "@/components/magicui/marquee";
import SectionText from "@/components/SectionText";
import Reveal from "@/components/Reveal";
import {
  HeartHandshake,
  Utensils,
  ArrowRight,
  Plus,
  BookOpen,
  Sparkles,
  Users,
} from "lucide-react";

export default async function HomePage() {
  const categories = await getCategories();
  return (
    <div className="relative z-10">
      <Header />

      <main className="mx-auto max-w-7xl space-y-16 px-4 sm:space-y-20 sm:px-6">
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
          <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card/90 via-card/50 to-muted/20 px-6 py-14 sm:px-12 sm:py-16 lg:py-20 text-center shadow-lg shadow-black/[0.02] backdrop-blur-xs">
            {/* Ambient Lighting Gradients */}
            <div
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-ethiopian-green/10 blur-3xl"
              aria-hidden="true"
            />

            {/* Subtle Ethiopian Mesob Woven Rings Motif */}
            <svg
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 stroke-primary/10 opacity-70 sm:h-96 sm:w-96"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="20" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="40" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="60" strokeWidth="1.2" strokeDasharray="3 5" />
              <circle cx="100" cy="100" r="80" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="100" cy="100" r="98" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
            <svg
              className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 stroke-primary/10 opacity-40 sm:h-96 sm:w-96"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="30" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="60" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="100" cy="100" r="90" strokeWidth="1.2" strokeDasharray="5 5" />
            </svg>

           

            <div className="relative z-10 mx-auto max-w-2xl">

              {/* Heading */}
              <h2 className="font-gosh text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Pull up a chair. <span className="text-primary">Eat together.</span>
              </h2>

              {/* Narrative Copy */}
              <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                In Amharic, <span className="font-medium text-foreground">gursha</span> is feeding a loved one with your own hands an act of shared love and respect. Discover authentic heirlooms, contribute your family recipes, and gather around the mesob.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-modern group h-12 w-full px-8 text-base shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all sm:w-auto"
                >
                  <Link href="/recipes" className="inline-flex items-center justify-center gap-2.5">
                    <Utensils className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    <span>Explore Recipes</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 w-full border-border/80 bg-background/60 px-8 text-base font-semibold text-foreground backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-card hover:text-primary sm:w-auto"
                >
                  <Link href="/recipes/create" className="inline-flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    <span>Share Your Recipe</span>
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
