import { BUCKET } from "@/constants/image";
import { supabase } from "@/lib/supabase-client";
import { Blog, Content } from "@/utils/types/blog";
import { Ingredient } from "@/utils/types/recipe";



export const getBlogs = async() => {
   const {data, error} = await supabase.rpc("get_all_blogs")

   if(error) throw error


   return data
}


export const getBlogBySlug = async(slug:string) =>{
    const {data, error}  = await supabase.rpc("get_blog_by_slug",
        {_slug: slug}
    )

    if(error) throw error

    return data
}


interface PostBlogFormData {
    blog: Blog;
    contents: Content[];
    ingredients: Ingredient[];
}

export const postBlog = async(formData: PostBlogFormData): Promise<Blog | null> => {
    const {data: newBlog, error} = await supabase.rpc("insert_blog", {
        _blog: formData.blog,
        _contents: formData.contents,
        _ingredients: formData.ingredients,
    })

    if(error) throw error
    return newBlog
}

export const deleteBlog = async(blog: Blog) => {
    const imagePaths = [
        blog.image?.path,
        ...blog?.contents.map((content: Content) => content.image?.path)
    ].filter((path) => typeof path === "string")

    const {error: BlogDeleteError, count} = await supabase.from("blog").delete({count: 'exact'}).eq("id", blog.id)

    if(BlogDeleteError) throw BlogDeleteError

    if(count && imagePaths.length > 0){
       await supabase.storage.from(BUCKET).remove(imagePaths);
    }
}


// export const uploadBlogImage = async(user_id: string, blog_id: string, file: File)=>{
//     const filePath = `blog/${user_id}/${file.name}_${Date.now()}`;

//     const {error} = await supabase.storage.from(BUCKET).upload(filePath, file, {
//         cacheControl:"3600",
//         upsert: true,
//     })

//     if(error) throw error

//     const {data} = await supabase.storage.from(BUCKET).getPublicUrl(filePath)
//     const {error: saveError} = await supabase.from("blog_image").insert({blog_id, url: data.publicUrl, path: filePath})

//     if(saveError) throw saveError
// } 


// export const uploadContentImage = async(user_id: string, content_id: string, file: File)=>{
//     const filePath = `content/${user_id}/${file.name}_${Date.now()}`
    
//     const {error} = await supabase.storage.from(BUCKET).upload(filePath, file,{
//         cacheControl:"3600",
//         upsert: true
//     })

//     if(error) throw error;

//     const {data} = await supabase.storage.from(BUCKET).getPublicUrl(filePath)
//     const {error: saveError} = await supabase.from("content_image").insert({content_id, url: data.publicUrl, path: filePath})

//     if(saveError) throw saveError
// }


export const uploadImage = async(type: 'content' | 'blog', user_id: string, post_id:string, file:File)=>{
    const filePath = `${type}/${user_id}/${file.name}_${Date.now()}`
    const table = type == 'blog' ? 'blog_image' : 'content_image'

    const {error} = await supabase.storage.from(BUCKET).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true
    })

    if(error) throw error

    const {data} = await supabase.storage.from(BUCKET).getPublicUrl(filePath)
    const row = {
        url: data.publicUrl,
        path: filePath,
        ...(type === 'blog' ? { blog_id: post_id } : { content_id: post_id })
    };
    const {error: saveError} = await supabase.from(table).insert(row)

    if(saveError) throw saveError
}