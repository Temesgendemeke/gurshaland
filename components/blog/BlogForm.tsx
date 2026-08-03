"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeOf, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  FileText,
  List,
  Upload,
  LoaderCircleIcon,
} from "lucide-react";
import { blogSchema, ImageSchema } from "@/utils/schema";
import { ContentSection } from "./ContentSection";
import categories from "@/constants/categories";
import ImageBox from "../ImageBox";
import {
  postBlog,
  uploadImage,
  upsertImageFromStorage,
  updateBlog as updateBlogAction,
  insertImageDb,
} from "@/actions/blog/blog";
import calculate_read_time from "@/utils/calculate_read_time";
import { generateUniqueSlug } from "@/utils/slugify";
import { blogStore } from "@/store/Blog";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import generate_error from "@/utils/generate_error";
import StatusSelect from "./StatusSelect";
import { Blog } from "@/utils/types/blog";
import { createClient } from "@/utils/supabase/client";
import deleteImageFromStorage, { deleteImageFromDb } from "@/actions/Image";
import { Noto_Sans_Old_Permic } from "next/font/google";

type BlogFormData = z.infer<typeof blogSchema>;
type ImageFormData = z.infer<typeof ImageSchema>;

export default function BlogForm({
  blog,
  mode,
}: {
  blog?: Blog;
  mode?: "create" | "update";
}) {
  const [tagInput, setTagInput] = useState("");
  const [openSections, setOpenSections] = useState<number[]>([]);
  const addBlog = blogStore((store) => store.addBlog);
  const user = useAuth((store) => store.user);
  const router = useRouter();
  const updateBlogStore = blogStore((store) => store.updateBlog);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      id: "",
      title: "",
      subtitle: "",
      category: "",
      tags: [],
      status: "draft",
      contents: [],
    },
  });

  useEffect(() => {
    if (blog && mode === "update") {
      form.reset({
        id: blog.id != null ? String(blog.id) : "",
        author_id: blog.author_id
          ? String(blog.author_id)
          : String(user?.id || ""),
        title: blog.title || "",
        subtitle: blog.subtitle || "",
        category: blog.category || "",
        tags: blog.tags || [],
        status: blog.status || "draft",
        image: blog.image
          ? {
              path: blog.image.path || "",
              url: blog.image.url || "",
              file: null,
            }
          : { path: "", url: "", file: null },
        contents: (blog.contents || []).map((c: any) => ({
          ...c,
          title: c?.title || "",
          body: c?.body || "",
        })),
      } as any);
    }
  }, [blog, mode, form]);

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
  } = useFieldArray({
    control: form.control,
    name: "contents",
  });

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index),
    );
  };

  const addContentSection = () => {
    appendContent({
      body: "",
      title: "",
      image: {
        path: "",
        url: "",
        file: null,
      },
    });
  };
  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const saveNewBlog = async (data: BlogFormData) => {
    const { image, ...rest } = data;
    const cleanData = {
      ...rest,
      author_id: user?.id,
      read_time: calculate_read_time(data) as string,
      slug: await generateUniqueSlug(data.title, "blog"),
      contents: data.contents
        ? data.contents.map(({ image, ...section }) => section)
        : [],
    };
    try {
      const newBlog = await postBlog(cleanData as any);

      console.log(
        "usser id ",
        user?.id,
        "blog id",
        newBlog.id,
        "main image ",
        data?.image?.file,
      );
      console.log("contents ", data.contents);
      if (data?.image?.file) {
        await uploadImage(
          "blog",
          user?.id!,
          newBlog.id!,
          data.image.file as File,
        );
      }
      // Upload content images using form values and returned content ids
      const sections = form.getValues("contents") || [];
      const returnedContents =
        (newBlog as any)?.contents || (newBlog as any)?.content || [];
      const createdIds = returnedContents.map((c: any) => c?.id);
      await Promise.all(
        sections.map(async (sec: any, index: number) => {
          const file = sec?.image?.file as File | null;
          const contentId = createdIds?.[index];
          if (file && contentId) {
            await uploadImage(
              "content",
              user?.id!,
              String(contentId),
              file as File,
            );
          }
        }),
      );

      addBlog(newBlog);
      toast.success("Blog post created successfully!");
      router.back();
    } catch (error) {
      console.log(error);
      toast.error(generate_error(error));
    }
  };

  const updateBlogHandler = async (data: BlogFormData) => {
    // console.log(data);
    // clean data
    // first upsert table
    // then upload cooresponing image
    try {
      const mainFile = data?.image?.file as File | null;
      let main_image = blog?.image;
      if (false && mainFile && blog?.id && user?.id) {
        main_image = await upsertImageFromStorage(
          "blog",
          blog?.image?.path,
          mainFile as File,
          user?.id!,
          String(blog?.id),
        );
      }
      const { image, ...rest } = data;
      const cleanBlog: Blog = {
        ...rest,
        image: main_image as any,
        author_id: user?.id!,
        id: String(blog?.id),
        read_time: calculate_read_time(data) as string,
        slug: blog?.slug ?? (await generateUniqueSlug(data.title, "blog")),
        contents: (rest as any)?.contents || [],
      };
      const res = await updateBlogAction(cleanBlog as Blog);
      if (mainFile && user?.id) {
        const targetId = String((res as any)?.id ?? blog?.id);
        await upsertImageFromStorage(
          "blog",
          blog?.image?.path,
          mainFile as File,
          user?.id!,
          targetId,
        );
      }
      res?.contents?.forEach(async (content, index) => {
        const { path: oldpath, url: oldURl } = blog?.contents?.[index]
          ?.image as ImageFormData;
        const newFile = (data?.contents?.[index] as any)?.image
          ?.file as File | null;
        if (newFile && content?.id && user?.id) {
          await upsertImageFromStorage(
            "content",
            oldpath,
            newFile as File,
            user?.id!,
            String(content.id),
          );
        } else if (oldURl && oldURl) {
          await insertImageDb(
            "content_image",
            user?.id!,
            oldpath!,
            oldURl!,
            String(content.id),
          );
        }
      });
      toast.success(`${blog?.title} blog updated successfully`);
    } catch (error) {
      console.log(error);
      toast.error(generate_error(error));
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    if (!user || !user.id) {
      router.push("/login");
      return;
    }

    if (mode === "create") {
      await saveNewBlog(data);
    } else {
      await updateBlogHandler(data);
    }
  };

  return (
    <div className="mx-auto p-6 space-y-8">
      {mode === "create" ? (
        <div className="text-center space-y-2">
          <h1 className="font-bold tracking-tight text-5xl ">
            Create New Blog Post
          </h1>
          <p className="text-muted-foreground">
            Fill in the details to create your blog post
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            <span className="">Edit Your Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Update and refine your Ethiopian culinary masterpiece below.
          </p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="bg-card/70 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2 ">
                <ImageBox
                  form={form}
                  field="image"
                  inputcls={"blog-image"}
                  label={"Blog"}
                  deleteImage={async (path) => {
                    await deleteImageFromDb(
                      "blog_image",
                      path,
                      form.watch(`id`),
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter blog title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-error">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  {...form.register("subtitle")}
                  placeholder="Enter subtitle (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {categories.map((category, index) => (
                          <SelectItem
                            className="captalize"
                            key={index}
                            value={category}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.category && (
                  <p className="text-sm text-error">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-4 mb-4">
                {(form.watch("tags") || []).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center text-[1rem] my-4 gap-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-error"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card className="bg-card/70 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Content Sections
            </CardTitle>
            <CardDescription>
              Add dynamic content sections to your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentFields?.map((field, index) => (
              <ContentSection
                key={field.id}
                index={index}
                form={form}
                onRemove={() => removeContent(index)}
                isOpen={openSections.includes(index)}
                onToggle={() => toggleSection(index)}
              />
            ))}

            <Button
              type="button"
              onClick={addContentSection}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Content Section
            </Button>
          </CardContent>
        </Card>

        {/* status select */}
        <StatusSelect form={form} />

        {/* Submit Button */}
        <div className="flex justify-center gap-4">
          <Button
            type="submit"
            className="btn-primary-modern"
            disabled={form.formState.isSubmitting}
            aria-disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="animate-spin" /> posting....{" "}
              </>
            ) : (
              <>
                {mode == "create" ? (
                  <>
                    <Upload className="h-5 w-5" />
                    Create Blog Post
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Update Blog Post
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
