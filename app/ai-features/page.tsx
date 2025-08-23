"use client";
import { useState, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import CTACard from "@/components/CTACard";
import stats from "@/constants/stats";
import aiFeatures from "@/constants/aiFeatures";
import howItWorks from "@/constants/howitworks";
import PageHeader from "@/components/PageHeader";
import AIFeaturesGrid from "@/components/AIFeaturesGrid";
import StatsSection from "@/components/StatsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AIRecipeGenerator from "@/components/AIRecipeGenerator";

export default function AIFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState("recipe-generator");
  const recipeGeneratorRef = useRef<HTMLDivElement>(null);

  const scrollToRecipeGenerator = () => {
    recipeGeneratorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="modern-gradient-bg min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <PageHeader />

        <AIFeaturesGrid
          features={aiFeatures}
          selected={selectedFeature}
          onSelect={setSelectedFeature}
          onGenerateRecipe={scrollToRecipeGenerator}
        />
        <section className="mb-16" ref={recipeGeneratorRef}>
          <AIRecipeGenerator />
        </section>
        <StatsSection stats={stats} />
        <HowItWorksSection steps={howItWorks} />
        <CTACard />
      </main>

      <Footer />
    </div>
  );
}
