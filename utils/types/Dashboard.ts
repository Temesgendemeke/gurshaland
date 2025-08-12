import { Follower, Profile } from "./recipe";

export interface Post {
  id: String;
  title: string;
  view: number;
  like: number;
  comments: number;
  created_at: string;
  status: "published" | "draft";
}

export interface FollowerColumnType extends Profile, Follower {
  id: string;
  followed_since: string;
  like: string;
  comments: string;
}