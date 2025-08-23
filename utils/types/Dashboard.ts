import { Follower, Profile } from "./recipe";

export interface Post {
  id: string;
  title: string;
  view_count: number;
  like: number;
  comment_count: number;
  created_at: string;
  status: "published" | "draft";
  slug?: string;
}

export interface FollowerColumnType extends Profile, Follower {
  id: string;
  followed_since: string;
  like: string;
  comments: string;
}


