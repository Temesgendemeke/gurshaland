import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FeaturedCards } from "@/components/featured-cards";
import { TrendingSection } from "@/components/trending-section";
import Link from "next/link";
import {
  BookOpenIcon as BookOpen,
  TrophyIcon as Award,
  UsersIcon as Group,
} from "@heroicons/react/24/outline";
import HeroSection from "@/components/HeroSection";
import generateImage from "@/utils/genAI";
import WhyCard from "@/components/WhyCard";
import why_gurshaland from "@/constants/homepage";

export default async function HomePage() {
  return (
    <div className="relative z-10">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <FeaturedCards />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-5xl font-bold heading-primary mb-3">
              Why Choose Gurshaland?
            </h2>
            <p className="text-2xl text-body">
              Your gateway to authentic Ethiopian cuisine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {why_gurshaland.map((item) => (
              <WhyCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={<item.icon className="w-8 h-8 text-primary-foreground" />}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Card className="p-10 text-center bg-linear-to-r from-primary/10 to-popular/10 border-primary/20 text-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of food lovers discovering the magic of Ethiopian
            cuisine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-card text-primary hover:bg-muted px-8 py-4 text-lg rounded-full"
            >
              <Link href="/recipes">Browse Recipes</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary-foreground bg-primary hover:bg-primary/90 px-8 py-4 text-lg rounded-full"
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
