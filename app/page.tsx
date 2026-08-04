import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FeaturedCards } from "@/components/featured-cards";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
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
            <h2 className="text-3xl font-bold heading-primary mb-3">
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
                icon={<item.icon className="w-8 h-8 text-primary-foreground" />}
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
