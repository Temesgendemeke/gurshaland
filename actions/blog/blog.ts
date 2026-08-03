import { BUCKET } from "@/constants/image";
import { createClient } from "@/utils/supabase/client";
import generateFilePath from "@/utils/supabase/generate_path";

import { Blog, BlogComment, Content } from "@/utils/types/blog";
import { Ingredient } from "@/utils/types/recipe";
import { string } from "zod";

export const getBlogs = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_all_blogs");

  if (error) throw error;

  return data;
};

export const getBlogBySlug = async (slug: string, user_id?: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_blog_by_slug", {
    blog_slug: slug,
    _user_id: user_id,
  });

  console.log("from actions blog", data);

  if (error) throw error;

  return data;
};

export const getBlogByAuthor = async (author_id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_blogs_by_author", {
    _author_id: author_id,
  });

  if (error) throw error;

  return data;
};

export const postBlog = async (blog: Blog): Promise<Blog> => {
  const supabase = createClient();

  const { data: newBlog, error } = await supabase.rpc("insert_blog", {
    _blog: blog,
  });
  console.log("from post", error);

  if (error) throw error;

  return newBlog;
};

export const deleteBlog = async (blog: Blog) => {
  const supabase = createClient();

  const contentImagePaths = Array.isArray(blog?.contents)
    ? blog.contents
        .map((content: Content) => content?.image?.path)
        .filter((p): p is string => typeof p === "string" && p.length > 0)
    : [];

  const imagePaths = [
    ...(typeof blog?.image?.path === "string" ? [blog.image.path] : []),
    ...contentImagePaths,
  ];

  const { error: BlogDeleteError, count } = await supabase
    .from("blog")
    .delete({ count: "exact" })
    .eq("id", blog.id);

  if (BlogDeleteError) throw BlogDeleteError;

  if ((count ?? 0) > 0 && imagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([...new Set(imagePaths)]);
    if (storageError) console.warn("Storage removal error:", storageError);
  }
};

export const uploadImage = async (
  type: "content" | "blog",
  user_id: string,
  post_id: string,
  file: File,
) => {
  const supabase = createClient();
  // const filePath = `${type}/${user_id}/${file.name}_${Date.now()}`;
  const filePath = generateFilePath(type, user_id, file.name);
  const table = type == "blog" ? "blog_image" : "content_image";

  console.log("table ", table);
  console.log("file path ", filePath);
  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  console.log("from here ", error);
  if (error) throw error;

  const { data } = await supabase.storage.from(BUCKET).getPublicUrl(filePath);
  const row = {
    url: data.publicUrl,
    path: filePath,
    ...(type === "blog" ? { blog_id: post_id } : { content_id: post_id }),
  };
  const { error: saveError } = await supabase.from(table).insert(row);
  if (saveError) throw saveError;

  return row;
};

export const updateBlog = async (blog: Blog): Promise<Blog> => {
  const supabase = createClient();

  console.log("Action: Calling update_full_blog RPC with:", blog);

  const { data: updatedBlog, error } = await supabase.rpc("update_full_blog", {
    _blog: blog,
  });

  console.log("Action: RPC response - data:", updatedBlog);
  console.log("Action: RPC response - error:", error);

  if (error) throw error;

  return updatedBlog;
};

export const upsertImageFromStorage = async (
  type: "content" | "blog" = "blog",
  oldpath: string | undefined,
  file: File,
  user_id: string,
  column_id: string,
) => {
  const supabase = createClient();
  const table = type === "blog" ? "blog_image" : "content_image";
  const relationColumn = type === "blog" ? "blog_id" : "content_id";

  if (oldpath) {
    // const { error: uploadError } = await supabase.storage
    //   .from(BUCKET)
    //   .upload(oldpath, file, {
    //     cacheControl: "3600",
    //     upsert: true,
    //     contentType: file?.type || "image/jpeg",
    //   });
    const { error: DeleteError } = await supabase.storage
      .from(BUCKET)
      .remove([oldpath]);

    const { error } = await supabase
      .from(table)
      .delete()
      .eq(relationColumn, column_id);

    if (DeleteError) throw DeleteError;

    const newFilePath = generateFilePath(type, user_id, file.name);

    const { error: UploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newFilePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file?.type || "image/jpeg",
      });

    if (UploadError) throw UploadError;

    const { data } = await supabase.storage
      .from(BUCKET)
      .getPublicUrl(newFilePath);

    const row = {
      url: data.publicUrl,
      path: newFilePath,
      ...(type === "blog" ? { blog_id: column_id } : { content_id: column_id }),
    };

    // column_id can be post or content id
    const { error: insertError } = await supabase.from(table).insert(row);

    // const { data: existing, error: fetchError } = await supabase
    //   .from(table)
    //   .select("id")
    //   .eq(relationColumn, post_id)
    //   .maybeSingle();

    // if (existing?.id) {
    //   const { error: updateError } = await supabase
    //     .from(table)
    //     .upsert(row)
    //     .eq("id", existing.id);
    //   if (updateError) throw updateError;
    // } else {
    //   const { error: insertError } = await supabase.from(table).insert(row);
    //   if (insertError) throw insertError;
    // }

    return row;
  }

  return uploadImage(type, user_id, column_id, file);
};

export const insertImageDb = async (
  table: "content_image" | "blog_image",
  user_id: string,
  path: string,
  url: string,
  id: string,
) => {
  const supabase = createClient();

  const { error: insertError } = await supabase.from(table).insert({
    url,
    path,
    user_id,
    ...(table == "blog_image" ? { blog_id: id } : { content_id: id }),
  });

  if (insertError) throw insertError;

  return { user_id, path, url, id };
};
