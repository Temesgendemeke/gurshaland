import { getBlogBySlug } from '@/actions/blog/blog';
import { deleteBlogComment, postBlogComment } from '@/actions/blog/comment';
import { toggleBlogLike } from '@/actions/blog/like';
import generate_error from '@/utils/generate_error';
import { Blog, BlogComment } from '@/utils/types/blog';
import {create} from 'zustand'

interface BlogDetailStore{
    blog: Blog | null;
    loading: boolean;
    error: string | null;
    isLiked: boolean;
    isBookmarekd: boolean;

    fetchBlog: (slug: string) => void;
    addComment: (comment: BlogComment) => void;
    deleteComment: (comment_id:string) => void;
    toggleLike: (user_id:string, blog_id:string) => void;
    setIsLiked: (user_id:string) => void; 
}

export const useBlogDetailStore = create<BlogDetailStore>((set, get) => ({
    blog: null,
    loading: false,
    error: null,
    isLiked: false,
    isBookmarekd: false,

    fetchBlog: async (slug: string) => {
        set({ loading: true });
        try {
            const blog: Blog = await getBlogBySlug(slug);
            set({ blog, loading: false });
        } catch (error) {
            set({ error: generate_error(error), loading: false });
        }
    },

    addComment: async(comment: BlogComment) => {
       try {
           const new_comment = await postBlogComment(comment)
           set((state) => ({
               blog: state.blog
                   ? { ...state.blog, comments: [...(state.blog.comments ?? []), new_comment] }
                   : state.blog,
           }));
       } catch (error) {
          set({error: generate_error(error)})
       }
    },

    deleteComment: async(comment_id: string) => {
        try {
            await deleteBlogComment(comment_id)
            set((state)=>({
                blog: state.blog ? {...state.blog, comments: state.blog.comments?.filter(c => c.id != comment_id)} : state.blog
            }))
        } catch (error) {
            set({error: generate_error(error)})
        }
    },

    toggleLike: async(user_id: string, blog_id: string) => {
       
        try {
            const liked = await toggleBlogLike(user_id, blog_id)
            if(liked){
                set((state) => ({
                    blog: state.blog ? {...state.blog, like: [...(state.blog.like ?? []), {liked_by: user_id, blog_id}]} : state.blog
                }))
            }else{
                set((state) => ({
                    blog: state.blog ? {...state.blog, like : (state.blog.like ?? []).filter((l) => l.liked_by != user_id)} : state.blog
                }))
            }
        } catch (error) {
            set({error: generate_error(error)})
        }
    },

    setIsLiked: (user_id: string) => set((state) => ({
        isLiked: state.blog && state.blog.like
            ? state.blog.like.some(l => l.liked_by === user_id)
            : false
    }))
}));