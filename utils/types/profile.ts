import Recipe, { Follower } from "./recipe";

export interface Profile {
    recipes: Recipe[];
    following: Follower[];
    followers: number;
    username: string;
    full_name: string;
    bio?: string;
    avatar_url: string;
    id: string;
}