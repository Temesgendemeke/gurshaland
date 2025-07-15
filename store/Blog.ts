import { Blog, BlogComment } from "@/utils/types/blog"
import {create} from "zustand"


interface BlogStore{
    blogs: Blog[] | null;
    loading: Boolean;
    setBlogs: (blogs: Blog[]) => void;
    addBlog: (blog: Blog) => void;
    removeBlog: (blog_id: string) => void;
    fetchBlogs: () => void;
    addComment: (comment: BlogComment) => void;
    removeComment: (comment_id: string) => void;
}


const blogStore = create<BlogStore>((set, get) => ({
    blogs: null,
    loading: false,

    fetchBlogs: ()=> set(()=>{
        
    }),

}))