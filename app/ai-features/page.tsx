"use client";
import { useState } from "react";
import { Header } from "@/components/header";
import aiFeatures from "@/constants/aiFeatures";
import howItWorks from "@/constants/howitworks";
import PageHeader from "@/components/PageHeader";
import AIFeaturesGrid from "@/components/AIFeaturesGrid";
import HowItWorksSection from "@/components/HowItWorksSection";

export default function AIFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState("recipe-generator");

  return (
    <div className="">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 mt-6 md:mt-12">
        <PageHeader />

        <AIFeaturesGrid
          features={aiFeatures}
          selected={selectedFeature}
          onSelect={setSelectedFeature}
        />
        {/* <HowItWorksSection steps={howItWorks} /> */}
      </main>
    </div>
  );
}
