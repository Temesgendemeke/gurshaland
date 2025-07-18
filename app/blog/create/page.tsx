import BlogForm from "@/components/blog/BlogForm";
import { Header } from "@/components/header";

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br  py-8">
        <BlogForm />
      </main>
    </>
  );
}
