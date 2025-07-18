import { deleteBlog, getBlogs, postBlog } from "@/actions/blog/blog";
import { deleteBlogComment, postBlogComment } from "@/actions/blog/comment";
import { Blog, BlogComment } from "@/utils/types/blog"
import {create} from "zustand"


interface Blogtypes{
    blog: Blog[]
}

interface BlogStore{
    blogs: Blog[] | null;
    loading: Boolean;
    error: string | null;
    setBlogs: (blogs: Blog[]) => void;
    addBlog: (blog: Blog) => void;
    removeBlog: (blog: Blog) => void;
    fetchBlogs: () => void;
    addComment: (comment: BlogComment) => void;
    removeComment: (comment_id: string) => void;
}





export const blogStore = create<BlogStore>((set, get) => ({
    blogs: null,
    loading: false,
    error: null,

    setBlogs: (blogs: Blog[]) => set({ blogs }),
    addBlog: (blog: Blog) => set(state => ({ blogs: state.blogs ? [...state.blogs, blog] : [blog] })),
    removeBlog: async (blog: Blog) => {
        try {
            await deleteBlog(blog)
            set(state => ({ blogs: state.blogs ? state.blogs.filter(b => b.id !== blog.id) : null}))
        } catch (error) {
          set({ error:"An error occurred." });
        }
    },
    addComment: async(comment: BlogComment) => {
        try {
            await postBlogComment(comment)
            set(state => ({
             blogs: state.blogs
            ? state.blogs.map(blog =>
                blog.id === comment.blog_id
                    ? { ...blog, comments: [...(blog.comments || []), comment] }
                    : blog
              )
            : null
            }))
        } catch (error) {
           set({ error:"An error occurred." });
        }
    },
    removeComment: async(comment_id: string) => {
        try {
            await deleteBlogComment(comment_id)
            set(state => ({
             blogs: state.blogs
                 ? state.blogs.map(blog => ({
                ...blog,
                comments: blog.comments
                    ? blog.comments.filter(c => c.id !== comment_id)
                    : []
               }))
               : null
         }))
        } catch (error) {
           set({ error:"An error occurred." });
        }
    },

    fetchBlogs: async () => {
        set({ loading: true });
        try {
            const blogsData = await getBlogs();
            set({ blogs: blogsData.map((b: Blogtypes) => b.blog)});
        } catch (error) {
            set({ error: typeof error === "string" ? error : (error instanceof Error ? error.message : "Unknown error") });
        } finally {
            set({ loading: false });
        }
    }

}));