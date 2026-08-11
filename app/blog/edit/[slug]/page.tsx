"use client";
import { motion, useReducedMotion } from "motion/react";
import BackNavigation from "@/components/BackNavigation";
import BlogForm from "@/components/blog/BlogForm";
import { Header } from "@/components/header";
import React, { useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useParams } from "next/navigation";
import { useBlogDetailStore } from "@/store/BlogDetail";

function Page(): React.JSX.Element {
  const param = useParams();
  const user = useAuth((store) => store.user);
  const fetchBlog = useBlogDetailStore((store) => store.fetchBlog);
  const blog = useBlogDetailStore((store) => store.blog);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (user?.id) {
      fetchBlog(param.slug as string, user.id);
    }
  }, [user?.id, param.slug]);

  return (
    <>
      <Header />
      <main className="min-h-[100dvh]">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
          <BackNavigation route="/blog" pagename="Blogs" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <div className="max-w-2xl">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-semibold uppercase tracking-[0.24em] text-primary"
            >
              Refine & Update
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 font-gosh text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Refine your
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
              Polish your post and share the latest version with the Gurshaland
              community.
            </motion.p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <BlogForm blog={blog ?? undefined} mode="update" />
        </div>
      </main>
    </>
  );
}

export default Page;
