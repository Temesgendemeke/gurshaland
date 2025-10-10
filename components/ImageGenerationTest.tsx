"use client";
import { useState } from "react";
import { generateRecipeImage } from "@/utils/genAI";

export default function ImageGenerationTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testImageGeneration = async () => {
    setIsLoading(true);
    setTestResult("Testing image generation...");

    try {
      console.log("🧪 Starting image generation test");
      const result = await generateRecipeImage(
        "Ethiopian traditional cuisine, colorful food"
      );

      if (result) {
        setTestResult(`✅ Success! Image URL: ${result.url}`);
        console.log("✅ Test successful:", result);
      } else {
        setTestResult("❌ Failed to generate image");
        console.log("❌ Test failed: no result");
      }
    } catch (error) {
      setTestResult(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      console.error("❌ Test error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Image Generation Test</h3>
      <button
        onClick={testImageGeneration}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Testing..." : "Test Image Generation"}
      </button>
      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre className="text-sm">{testResult}</pre>
        </div>
      )}
    </div>
  );
}
