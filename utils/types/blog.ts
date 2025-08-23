import { BlogLike } from "./recipe";

export interface Blog{
    id?: string;
    title: string;
    subtitle?: string;
    author_id?: string;
    created_at?: string;
    read_time: string;
    category: string;
    tags?: string[];
    contents: Content[];
    slug: string;
    status: 'draft' | 'published';
    image?: BlogImage;
    comments?: BlogComment[];
    featured?: Boolean;
    author?: Author;
    like?: BlogLike[];
    view_count?: number;
}

interface Author {
    full_name: string;
    username: string;
    avatar: string;
}

export interface Content{
    id?: string;
    body: string;
    title: string;
    blog_id?: string;
    image?: ContentImage;
    items?: string[];
    recipe?: BlogContentRecipe;
    tips?: Tips;
}

interface Tips{
    title: string;
    items: string[];
}

interface BlogContentRecipe{
    title: string;
    ingredients: Ingredient;
    instructions: string[];
}

interface Image{
    url: string;
    path: string;
}

interface BlogImage extends Image{
    blog_id?: string;
}

interface ContentImage extends Image{
    content_id?: string;
}

export interface Ingredient{
    amount: string;
    name: string;
    content_id?: string;
}

export interface BlogComment{
    comment: string;
    user_id?: string;
    blog_id: string;
    id?: string;
}


