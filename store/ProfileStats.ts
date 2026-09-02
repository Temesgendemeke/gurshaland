import { create } from "zustand";

interface ProfileStatsState {
  followers: number;
  isFollowing: boolean;
  init: (followers: number, isFollowing: boolean) => void;
  setFollowing: (following: boolean) => void;
}

export const useProfileStats = create<ProfileStatsState>((set) => ({
  followers: 0,
  isFollowing: false,
  init: (followers, isFollowing) => set({ followers, isFollowing }),
  setFollowing: (following) =>
    set((state) => ({
      isFollowing: following,
      followers: state.followers + (following ? 1 : -1),
    })),
}));
