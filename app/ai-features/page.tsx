"use client";
import { useState } from "react";
import { Header } from "@/components/header";
import aiFeatures from "@/constants/aiFeatures";
import PageHeader from "@/components/PageHeader";
import AIFeaturesGrid from "@/components/AIFeaturesGrid";

export default function AIFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState("recipe-generator");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-3.5 py-8 sm:px-6 sm:py-12 lg:px-8">
        <PageHeader />

        <AIFeaturesGrid
          features={aiFeatures}
          selected={selectedFeature}
          onSelect={setSelectedFeature}
        />
      </main>
    </div>
  );
}
