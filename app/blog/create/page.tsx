"use client";
import { motion, useReducedMotion } from "motion/react";
import BlogForm from "@/components/blog/BlogForm";
import { Header } from "@/components/header";

export default function Page() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Header />
      <main className="min-h-[100dvh]">
        {/* Asymmetric Hero - Left aligned, generous whitespace */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <div className="max-w-2xl">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-semibold uppercase tracking-[0.24em] text-primary"
            >
              Write & Share
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 font-gosh text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl leading-[1.1]"
            >
              Create your
              <span className="relative text-primary">
                {" "}
                story
                <span className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-primary/40" />
              </span>
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Share a recipe, a memory, or a discovery with the Gurshaland
              community.
            </motion.p>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16">
          <BlogForm mode="create" />
        </div>
      </main>
    </>
  );
}