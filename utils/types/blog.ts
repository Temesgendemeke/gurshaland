export interface Blog{
    id: string;
    title: string;
    subtitle: string;
    author_id: string;
    created_at: string;
    read_time: string;
    category: string;
    tags: string[];
    contents: Content[];
    slug: string;
    status: 'draft' | 'published';
    image?: BlogImage;
}

export interface Content{
    label: string;
    body: string;
    title: string;
    blog_id?: string;
    ingredients?: Ingredient[];
    image?: ContentImage;
    instructions?: string[];
    items: string[];
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
    content_id: string;
}

export interface BlogComment{
    comment: string;
    user_id?: string;
    blog_id: string;
}


