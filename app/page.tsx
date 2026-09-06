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
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 xl:w-1/6 bg-linear-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 xl:w-1/6 bg-linear-to-l from-background"></div>
          </div>
        </div>

        {/* Featured Content */}
        <section>
          <FeaturedCards />
        </section>

        {/* Features */}
        {/* <section>
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
        </section> */}

        
      </main>
    </div>
  );
}
