"use client";
import { motion, useReducedMotion } from "motion/react";
import BlogForm from "@/components/blog/BlogForm";
import { Header } from "@/components/header";
import React from "react";

export default function Page() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Header />
      <div className="w-full mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="mt-6 space-y-3 text-center flex flex-col items-center justify-center">
            <h1 className="font-gosh text-3xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Share your story
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Share your stories, culinary journeys, and cultural experiences.
            </p>
          </div>
          {/* Form */}
          <div className="mt-10">
            <BlogForm mode="create" />
          </div>
        </div>
      </div>
    </>
  );
}
