import { create } from "zustand";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface Auth {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuth = create<Auth>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
