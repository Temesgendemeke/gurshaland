import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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

export default async function HomePage() {
  return (
    <div className=" min-h-screen">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <FeaturedCards />
        </div>
      </section>

      {/* Trending Section */}
      {/* <section className="py-16 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <TrendingSection />
        </div>
      </section> */}

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold heading-primary mb-3">
              Why Choose Gurshaland?
            </h2>
            <p className="text-lg text-body">
              Your gateway to authentic Ethiopian cuisine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group modern-card modern-card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold heading-primary mb-4">
                Authentic Recipes
              </h3>
              <p className="text-body leading-relaxed">
                Traditional recipes passed down through generations, shared by
                Ethiopian families and chefs worldwide.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group modern-card modern-card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-primary/60  rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Group className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold heading-primary mb-4">
                Vibrant Community
              </h3>
              <p className="text-body leading-relaxed">
                Connect with fellow food lovers, share your creations, and learn
                from experienced Ethiopian cooks.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group modern-card modern-card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold heading-primary mb-4">
                Cultural Heritage
              </h3>
              <p className="text-body leading-relaxed">
                Learn about the rich history and cultural significance behind
                every dish and dining tradition.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Card className="p-10 text-center bg-gradient-to-r from-primary/10 to-popular/10 border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
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

      <Footer />
    </div>
  );
}
