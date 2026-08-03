import { create } from "zustand";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface Auth {
  user: User | null;
  username: string | null;
  setUser: (user: User) => void;
  setUserName: (username: string) => void;
  clearUser: () => void;
}

export const useAuth = create<Auth>((set) => ({
  user: null,
  username: null,
  setUserName: (username: string) => set({ username }),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, username: null }),
}));
