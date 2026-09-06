"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import {
  IconPlus as Plus,
  IconMinus as Minus,
  IconFileText as FileText,
  IconList as List,
  IconUpload as Upload,
  IconLoader as LoaderCircle,
  IconPencil as PenSquare,
  IconPhoto as PhotoIcon,
} from "@tabler/icons-react";
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
import { useBlogDetailStore } from "@/store/BlogDetail";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import generate_error from "@/utils/generate_error";
import StatusSelect from "./StatusSelect";
import { Blog } from "@/utils/types/blog";
import deleteImageFromStorage, { deleteImageFromDb } from "@/actions/Image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Tag, X } from "lucide-react";

type BlogFormData = z.infer<typeof blogSchema>;
type ImageFormData = z.infer<typeof ImageSchema>;

export default function BlogForm({
  blog,
  mode,
}: {
  blog?: Blog;
  mode?: "create" | "update";
}) {
  const getInitialValues = (b?: Blog): BlogFormData => {
    return {
      id: b?.id != null ? String(b.id) : "",
      title: b?.title || "",
      subtitle: b?.subtitle || "",
      category: b?.category || "",
      tags: b?.tags || [],
      status: b?.status || "draft",
      image: b?.image && (b.image.url || b.image.path)
        ? {
            path: b.image.path || "",
            url: b.image.url || "",
            file: null,
          }
        : { path: "", url: "", file: null },
      contents: (b?.contents || []).map((c: any) => {
        const hasRecipe = Boolean(
          c?.recipe ||
          (Array.isArray(c?.instructions) && c.instructions.length > 0) ||
          (Array.isArray(c?.ingredients) && c.ingredients.length > 0)
        );

        const hasTips = Boolean(
          c?.tips ||
          (Array.isArray(c?.items) && c.items.length > 0) ||
          (Array.isArray(c?.tips?.items) && c.tips.items.length > 0)
        );

        return {
          ...c,
          id: c?.id != null ? String(c.id) : undefined,
          title: c?.title || "",
          body: c?.body || "",
          image: c?.image && (c.image.url || c.image.path)
            ? {
                path: c.image.path || "",
                url: c.image.url || "",
                file: null,
              }
            : { path: "", url: "", file: null },
          recipe: hasRecipe
            ? {
                title: c?.recipe?.title || c?.title || "",
                ingredients: (c?.recipe?.ingredients || c?.ingredients || []).map(
                  (ing: any) => ({
                    amount:
                      ing?.amount !== undefined && ing?.amount !== null
                        ? ing.amount
                        : undefined,
                    measurement: ing?.measurement || "",
                    name: ing?.name || "",
                  }),
                ),
                instructions: (
                  c?.recipe?.instructions ||
                  c?.instructions ||
                  []
                ).map((ins: any) =>
                  typeof ins === "string" ? ins : ins?.text || "",
                ),
              }
            : undefined,
          tips: hasTips
            ? {
                title: c?.tips?.title || "",
                description: c?.tips?.description || "",
                items: (c?.tips?.items || c?.items || []).map((item: any) =>
                  typeof item === "string" ? item : item?.text || "",
                ),
              }
            : undefined,
        };
      }),
    };
  };

  const [tagInput, setTagInput] = useState("");
  const [openSections, setOpenSections] = useState<number[]>(() =>
    blog?.contents && blog.contents.length > 0
      ? blog.contents.map((_, i) => i)
      : [0],
  );
  const addBlog = blogStore((store) => store.addBlog);
  const user = useAuth((store) => store.user);
  const router = useRouter();
  const updateBlogStore = blogStore((store) => store.updateBlog);
  const reduceMotion = useReducedMotion();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: getInitialValues(blog),
  });

  useEffect(() => {
    if (blog && mode === "update") {
      const initial = getInitialValues(blog);
      form.reset(initial);
      const sectionIndices = (blog.contents || []).map((_, i) => i);
      setOpenSections(sectionIndices.length > 0 ? sectionIndices : [0]);
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
        ? data.contents.map(({ image, ...section }: any) => ({
            ...section,
            instructions:
              section?.recipe?.instructions || section?.instructions || [],
            items: section?.tips?.items || section?.items || [],
            ingredients:
              section?.recipe?.ingredients || section?.ingredients || [],
          }))
        : [],
    };
    try {
      const newBlog = await postBlog(cleanData as any);

      if (data?.image?.file) {
        await uploadImage(
          "blog",
          user?.id!,
          newBlog.id!,
          data.image.file as File,
        );
      }
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
      const newSlug = newBlog?.slug || cleanData.slug;
      if (newSlug) {
        router.push(`/blog/${newSlug}`);
        router.refresh();
      } else {
        router.back();
      }
    } catch (error) {
      console.log(error);
      toast.error(generate_error(error));
    }
  };

  const updateBlogHandler = async (data: BlogFormData) => {
    try {
      const mainFile = data?.image?.file as File | null;
      let main_image = blog?.image;
      if (mainFile && blog?.id && user?.id) {
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
        contents: ((rest as any)?.contents || []).map((c: any) => ({
          ...c,
          instructions: c?.recipe?.instructions || c?.instructions || [],
          items: c?.tips?.items || c?.items || [],
          ingredients: c?.recipe?.ingredients || c?.ingredients || [],
        })),
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
      if (res?.contents && Array.isArray(res.contents)) {
        await Promise.all(
          res.contents.map(async (content, index) => {
            const existing = blog?.contents?.[index]?.image as ImageFormData | undefined;
            const oldpath = existing?.path;
            const oldURl = existing?.url;
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
          }),
        );
      }
      const targetSlug = cleanBlog.slug || blog?.slug;
      if (targetSlug) {
        await useBlogDetailStore.getState().fetchBlog(targetSlug, user?.id);
      }
      toast.success(`${cleanBlog.title || blog?.title} updated successfully`);
      if (targetSlug) {
        router.push(`/blog/${targetSlug}`);
        router.refresh();
      } else {
        router.back();
      }
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 pb-12 bg-card border border-border p-4"
    >
      {/* Cover Image - Full width, no card wrapper */}
      <Card className="space-y-4">
        <CardHeader>
          {/* <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PhotoIcon className="h-4 w-4" strokeWidth={1.5} />
          </span> */}
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            This information will be displayed at the top of your post.

          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 md:space-y-4">
          <div className="grid lg:grid-cols-2 w-full items-center gap-y-2 ">
            <ImageBox
              form={form}
              field="image"
              inputcls="blog-image"
              label="Cover"
              deleteImage={async (path) => {
                await deleteImageFromDb("blog_image", path, form.watch("id"));
              }}
            />

            <div className="">
              {/* Basic Info - Direct spacing, no card */}
              <Card className=" border-none">
                {/* <Separator className="opacity-40" /> */}
                {/* <CardHeader>
                  <CardTitle className="">Basic Information</CardTitle>
                  <CardDescription className="">
                    This information will be displayed at the top of your post.
                  </CardDescription>
                </CardHeader> */}

                <CardContent className="space-y-2">
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-foreground"
                    >
                      Title <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="title"
                      className="h-11 text-lg"
                      {...form.register("title")}
                      placeholder="Enter your blog title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-error" role="alert">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Subtitle */}
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="subtitle"
                      className="text-sm font-medium text-foreground"
                    >
                      Subtitle
                    </Label>
                    <Input
                      id="subtitle"
                      className="h-11"
                      {...form.register("subtitle")}
                      placeholder="A brief summary (optional)"
                    />
                    {form.formState.errors.subtitle && (
                      <p className="text-sm text-error" role="alert">
                        {form.formState.errors.subtitle.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="category"
                      className="text-sm font-medium text-foreground"
                    >
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
                            <SelectValue placeholder="Select a category" />
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
                    {form.formState.errors.category && (
                      <p className="text-sm text-error" role="alert">
                        {form.formState.errors.category.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add tags to help categorize your post. Press Enter or click the plus
            button to add a tag.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Tags */}
          <div className="flex flex-col gap-2 ">
            {/* <Label className="text-sm font-medium text-foreground">Tags</Label> */}
            {(form.watch("tags") || []).length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {(form.watch("tags") || []).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-primary/30 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
                  >
                    <Tag className="mr-1 h-3 w-3" strokeWidth={1.5} />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-primary-foreground/80 transition-colors"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" strokeWidth={2} />
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
                className="h-10 flex-1"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="h-10 shrink-0 px-4 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-colors"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections - Direct spacing */}
      <Card className="space-y-6 pt-4">
        {/* <Separator className="opacity-40" /> */}

        <CardHeader className="gap-2">
          {/* <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <List className="h-4 w-4" strokeWidth={1.5} />
          </span> */}
          <CardTitle className="">Content Sections</CardTitle>
          <CardDescription className="">
            Add multiple sections to your blog post. Each section can have its
            own title, body, and image.
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

          <motion.button
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            type="button"
            onClick={addContentSection}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border-dashed border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200 "
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            <span className="font-medium">Add Content Section</span>
          </motion.button>
        </CardContent>
      </Card>

      {/* Status Select */}
      {/* <div className="space-y-4 pt-4"> */}
      {/* <Separator className="opacity-40" /> */}
      <StatusSelect form={form} />
      {/* </div> */}

      {/* Submit Button */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3 pt-6"
      >
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          aria-disabled={form.formState.isSubmitting}
          className="h-12 min-w-[14rem] rounded-full px-8 text-base font-semibold"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderCircle
                className="mr-2 h-4 w-4 animate-spin"
                strokeWidth={2}
              />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" strokeWidth={1.5} />
              <span>
                {mode === "create" ? "Publish Story" : "Save Changes"}
              </span>
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
