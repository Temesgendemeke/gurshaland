"use client";
import { useState } from "react";
import ImageGenerationTest from "@/components/ImageGenerationTest";

export default function TestImagePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Generation Test</h1>
      <ImageGenerationTest />
    </div>
  );
}
