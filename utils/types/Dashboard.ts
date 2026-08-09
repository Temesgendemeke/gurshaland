import { Follower, Profile } from "./recipe";

export interface Post {
  id: string;
  title: string;
  slug: string;
  image_url?: string | null;
  view_count: number;
  view?: number;
  like_count: number;
  like?: number;
  comment_count: number;
  comments?: number;
  average_rating?: number;
  rating_count?: number;
  engagement_score?: number;
  created_at?: string;
  status?: "published" | "draft";
}

export interface FollowerColumnType extends Profile, Follower {
  id: string;
  followed_since: string;
  like: string;
  comments: string;
}


