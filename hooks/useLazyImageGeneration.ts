"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { generateRecipeImage } from '@/utils/genAI';

interface ImageState {
  url: string;
  path: string;
  isLoading: boolean;
  error?: string;
}

interface UseLazyImageGenerationProps {
  instructions: Array<{
    imagePrompt: string;
    image?: ImageState;
  }>;
}

interface UseLazyImageGenerationReturn {
  stepImages: { [key: number]: ImageState };
  generateImageForStep: (stepIndex: number) => Promise<void>;
  isGenerating: boolean;
}

// Global cache to prevent duplicate API calls
const imageCache = new Map<string, ImageState>();

export const useLazyImageGeneration = ({ 
  instructions 
}: UseLazyImageGenerationProps): UseLazyImageGenerationReturn => {
  const [stepImages, setStepImages] = useState<{ [key: number]: ImageState }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const generatingRef = useRef<Set<number>>(new Set());
  const stepImagesRef = useRef<{ [key: number]: ImageState }>({});

  // Initialize step images with placeholders
  useEffect(() => {
    const initialImages: { [key: number]: ImageState } = {};
    instructions.forEach((instruction, index) => {
      if (instruction.image?.isLoading) {
        initialImages[index] = {
          url: "/placeholder-step.svg",
          path: `placeholder-step-${index}`,
          isLoading: true
        };
      } else if (instruction.image) {
        initialImages[index] = instruction.image;
      }
    });
    setStepImages(initialImages);
    stepImagesRef.current = initialImages;
  }, [instructions]);

  // Keep ref in sync with state
  useEffect(() => {
    stepImagesRef.current = stepImages;
  }, [stepImages]);

  const generateImageForStep = useCallback(async (stepIndex: number) => {
    console.log(`🖼️ generateImageForStep called for step ${stepIndex}`);
    const instruction = instructions[stepIndex];
    if (!instruction?.imagePrompt) {
      console.log(`❌ No imagePrompt for step ${stepIndex}`);
      return;
    }
    console.log(`📝 ImagePrompt for step ${stepIndex}:`, instruction.imagePrompt);

    // Check cache first
    const cacheKey = instruction.imagePrompt;
    if (imageCache.has(cacheKey)) {
      const cachedImage = imageCache.get(cacheKey)!;
      setStepImages(prev => ({
        ...prev,
        [stepIndex]: cachedImage
      }));
      return;
    }

    // Check if already generating or loaded
    if (generatingRef.current.has(stepIndex)) {
      return; // Already generating this step
    }
    
    // Check if already loaded by accessing ref
    const currentImage = stepImagesRef.current[stepIndex];
    if (currentImage && !currentImage.isLoading) {
      return; // Already loaded, no need to generate
    }

    generatingRef.current.add(stepIndex);
    setIsGenerating(true);
    
    // Update state to show loading
    setStepImages(prev => ({
      ...prev,
      [stepIndex]: {
        url: "/placeholder-step.svg",
        path: `placeholder-step-${stepIndex}`,
        isLoading: true
      }
    }));

    try {
      const generatedImage = await generateRecipeImage(instruction.imagePrompt);
      
      if (generatedImage) {
        const newImageState: ImageState = {
          url: generatedImage.url,
          path: generatedImage.path,
          isLoading: false
        };

        // Cache the result
        imageCache.set(cacheKey, newImageState);

        // Update state with generated image
        setStepImages(prev => ({
          ...prev,
          [stepIndex]: newImageState
        }));
      } else {
        // Keep placeholder on error
        setStepImages(prev => ({
          ...prev,
          [stepIndex]: {
            url: "/placeholder-step.svg",
            path: `placeholder-step-${stepIndex}`,
            isLoading: false,
            error: "Failed to generate image"
          }
        }));
      }
    } catch (error) {
      console.error(`Error generating image for step ${stepIndex}:`, error);
      setStepImages(prev => ({
        ...prev,
        [stepIndex]: {
          url: "/placeholder-step.svg",
          path: `placeholder-step-${stepIndex}`,
          isLoading: false,
          error: "Error generating image"
        }
      }));
    } finally {
      generatingRef.current.delete(stepIndex);
      setIsGenerating(false);
    }
  }, [instructions]);

  return {
    stepImages,
    generateImageForStep,
    isGenerating
  };
};