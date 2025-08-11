"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "lucide-react";
import { blogSchema } from "@/utils/schema";
import { ContentSection } from "./ContentSection";
import categories from "@/constants/categories";
import ImageBox from "../ImageBox";
import { postBlog, uploadImage } from "@/actions/blog/blog";
import calculate_read_time from "@/utils/calculate_read_time";
import { generateUniqueSlug } from "@/utils/slugify";
import { blogStore } from "@/store/Blog";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import generate_error from "@/utils/generate_error";
import StatusSelect from "./StatusSelect";

type BlogFormData = z.infer<typeof blogSchema>;

export default function BlogForm() {
  const [tagInput, setTagInput] = useState("");
  const [openSections, setOpenSections] = useState<number[]>([]);
  const addBlog = blogStore((store) => store.addBlog);
  const user = useAuth((store) => store.user);
  const router = useRouter();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      category: "",
      tags: [] as string[],
      status: "draft",
      image: {
        path: "",
        url: "",
        file: null,
      },
      content: [],
    },
  });

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
  } = useFieldArray({
    control: form.control,
    name: "content",
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
      currentTags.filter((_, i) => i !== index)
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
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const onSubmit = async (data: BlogFormData) => {
    if (!user || !user.id) {
      router.push("/login");
      return;
    }
    const { image, ...rest } = data;
    const cleanData = {
      ...rest,
      read_time: calculate_read_time(data) as string,
      slug: await generateUniqueSlug(data.title, "blog"),
      contents: data.content
        ? data.content.map(({ image, ...section }) => section)
        : [],
    };
    try {
      const newBlog = await postBlog(cleanData);
      console.log(
        "usser id ",
        user.id,
        "blog id",
        newBlog.id,
        "main image ",
        data.image.file
      );
      console.log("content ", data.content);
      await uploadImage("blog", user.id!, newBlog.id!, data.image.file);
      data.content?.forEach(async (c, index) => {
        if (c.image?.file) {
          await uploadImage(
            "content",
            user?.id!,
            newBlog.contents?.[index]?.id!,
            c.image.file
          );
        }
      });
      addBlog(newBlog);
      toast.success("Blog post created successfully!");
      router.push("/blog");
    } catch (error) {
      console.log(error);
      toast.error(generate_error(error));
    }
  };

  return (
    <div className="mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-bold tracking-tight text-5xl ">
          Create New Blog Post
        </h1>
        <p className="text-muted-foreground">
          Fill in the details to create your blog post
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
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
                  field="image.file"
                  inputcls={"blog-image"}
                  label={"Blog"}
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
                  <p className="text-sm text-red-500">
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
                  <p className="text-sm text-red-500">
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
                    className="flex items-center gap-1 bg-emerald-500 cursor-pointer"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-red-500"
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
        <Card className="bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
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
        <StatusSelect form={form}/>

        {/* Submit Button */}
        <div className="flex justify-center gap-4">
          <Button type="submit" className="btn-primary-modern">
            <Upload className="h-5 w-5" />
            Create Blog Post
          </Button>
        </div>
      </form>
    </div>
  );
}
