import { deleteBlog, getBlogByAuthor, getBlogBySlug } from "@/actions/blog/blog";
import generate_error from "@/utils/generate_error";
import { create } from "zustand";
import { Blog as GeneralBlogType } from "@/utils/types/blog";
import { Post } from "@/utils/types/Dashboard";


// interface DashboardBlog{
//     id: string;
//     title: string;
//     slug: string;
//     view: number;
//     like: number;
//     comments: number;
//     created_at: string;
//     status: 'published' | 'draft' 
// }


interface Blog{
    blogs: Post[];
    loading: Boolean;
    error: string | null;
    fetchBlogs: (author_id: string) => void;
    deleteBlog: (slug: string) => void;
}

export const useBlog = create<Blog>((set, get)=> ({
    blogs: [],
    loading: false,
    error: null,

    fetchBlogs: async(author_id) => {
        try {
            set({loading: true})
            const data: Post[]  = await getBlogByAuthor(author_id)
            set({blogs: data, loading: false})
        } catch (error) {
            set({error: generate_error(error), loading: false})
        }
    },
    deleteBlog: async(slug) => {
        
        try {
            if(slug){
                set({loading: true})
                const data: GeneralBlogType = await getBlogBySlug(slug)
                await deleteBlog(data)
                set((state) => ({loading: false, blogs: state.blogs.filter(blog => blog.slug !== slug)}))
            }else{
                set({ error: "No slug provided for deletion." })
            }
        } catch (error) {
            set({error: generate_error(error)})
        }
    }
}))