import Recipe, { Follower } from "./recipe";
import { Blog } from "./blog";

export interface Profile {
    recipes: Recipe[];
    following: Follower[];
    followers: number;
    username: string;
    full_name: string;
    bio?: string;
    avatar_url: string;
    id: string;
    blogs?: Blog[];
    is_following?: boolean;
}