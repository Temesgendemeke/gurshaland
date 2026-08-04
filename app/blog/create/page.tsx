import BlogForm from "@/components/blog/BlogForm";
import { Header } from "@/components/header";

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <BlogForm />
      </main>
    </>
  );
}
