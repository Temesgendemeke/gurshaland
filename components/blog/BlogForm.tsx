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
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary">
          {mode === "create" ? "New Story" : "Edit Story"}
        </p>
        <h1 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
          {mode === "create" ? "Create a blog post" : "Edit your blog"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "create"
            ? "Share a story, recipe, or insight with the Gurshaland community."
            : "Update and refine your story below."}
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pb-10"
      >
        {/* Basic Information */}
        <Card className="overflow-visible rounded-xl border-border/70 shadow-[0_1px_2px_hsl(215_15%_10%/0.04)]">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </span>
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-visible">
            <div className="overflow-visible rounded-lg border border-border/60 bg-muted/20 p-4 sm:p-5">
              <div className="grid gap-6 overflow-visible md:grid-cols-2">
                {/* <ImageBox
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
                /> */}
                <div className="pt-0.5">
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

                <div className="flex flex-col gap-4 max-w-lg">
                  {/* Title */}
                  <div className="flex flex-col">
                    <Label htmlFor="title" className="text-foreground mb-2">
                      Title <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="title"
                      className="h-11"
                      {...form.register("title")}
                      placeholder="Enter blog title"
                    />
                    <p
                      className={`text-sm text-error mt-1.5 h-5 ${form.formState.errors.title ? "block" : "hidden"}`}
                    >
                      {form.formState.errors.title?.message || ""}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col">
                    <Label htmlFor="category" className="text-foreground mb-2">
                      Category <span className="text-error">*</span>
                    </Label>
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="category" className="h-11 w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {categories.map((category, index) => (
                              <SelectItem
                                key={index}
                                value={category}
                                className="capitalize"
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <p
                      className={`text-sm text-error mt-1.5 h-5 ${form.formState.errors.category ? "block" : "hidden"}`}
                    >
                      {form.formState.errors.category?.message || ""}
                    </p>
                  </div>

                  {/* Subtitle */}
                  <div className="flex flex-col">
                    <Label htmlFor="subtitle" className="text-foreground mb-2">
                      Subtitle
                    </Label>
                    <Input
                      id="subtitle"
                      className="h-11"
                      {...form.register("subtitle")}
                      placeholder="Enter subtitle (optional)"
                    />
                    <p
                      className={`text-sm text-error mt-1.5 h-5 ${form.formState.errors.subtitle ? "block" : "hidden"}`}
                    >
                      {form.formState.errors.subtitle?.message || ""}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col">
                    <Label className="text-foreground mb-2">Tags</Label>

                    {(form.watch("tags") || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 pb-0.5">
                        {(form.watch("tags") || []).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-1 hover:text-error"
                              aria-label={`Remove ${tag}`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="h-11"
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        className="h-11 shrink-0 px-4"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card className="rounded-xl border-border/70 shadow-[0_1px_2px_hsl(215_15%_10%/0.04)]">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <List className="h-4 w-4" />
              </span>
              Content Sections
            </CardTitle>
            <CardDescription>
              Add dynamic content sections to your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
              className="w-full border-dashed bg-transparent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Content Section
            </Button>
          </CardContent>
        </Card>

        {/* Status select */}
        <StatusSelect form={form} />

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            aria-disabled={form.formState.isSubmitting}
            className="h-12 min-w-56 rounded-full px-8"
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                {mode === "create" ? "Publish Story" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
