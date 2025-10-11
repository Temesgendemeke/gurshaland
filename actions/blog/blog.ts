import { BUCKET } from "@/constants/image";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
import { Blog, BlogComment, Content } from "@/utils/types/blog";
import { Ingredient } from "@/utils/types/recipe";



export const getBlogs = async() => {
   const {data, error} = await supabase.rpc("get_all_blogs")

   if(error) throw error


   return data
}


export const getBlogBySlug = async(slug:string) =>{
    const {data, error}  = await supabase.rpc("get_blog_by_slug",
        {blog_slug: slug}
    )

    if(error) throw error

    return data
}

export const getBlogByAuthor = async(author_id: string)=>{
    const {data, error}  = await supabase.rpc("get_blogs_by_author", 
        {_author_id: author_id}
    )

    if(error) throw error 

    return data
}


export const postBlog = async(blog: Blog): Promise<Blog> => {
    const {data: newBlog, error} = await supabase.rpc("insert_blog", {
        _blog: blog,
    })
     console.log("from post", error);

    if(error) throw error
   
    return newBlog
}

export const deleteBlog = async (blog: Blog) => {
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
}



export const uploadImage = async(type: 'content' | 'blog', user_id: string, post_id:string, file:File)=>{
    const filePath = `${type}/${user_id}/${file.name}_${Date.now()}`
    const table = type == 'blog' ? 'blog_image' : 'content_image'

    console.log('table ', table);
    console.log('file path ', filePath);
    const {error} = await supabase.storage.from(BUCKET).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "image/jpeg"
    })
    console.log("from here ", error);
    if(error) throw error;


    const {data} = await supabase.storage.from(BUCKET).getPublicUrl(filePath)
    const row = {
        url: data.publicUrl,
        path: filePath,
        ...(type === 'blog' ? { blog_id: post_id } : { content_id: post_id })
    };
    const {error: saveError} = await supabase.from(table).insert(row)
    if(saveError) throw saveError
}

