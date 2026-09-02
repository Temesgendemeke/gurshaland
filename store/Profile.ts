import { create } from "zustand";
import { Profile } from "@/utils/types/Settings";
import { getProfileByID } from "@/actions/profile/getProfile";

interface ProfileType {
  profile: Profile | null;
  status: "idle" | "loading" | "loaded";
  loadedUserId: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

const useProfile = create<ProfileType>((set, get) => ({
  profile: null,
  status: "idle",
  loadedUserId: null,
  fetchProfile: async (userId: string) => {
    if (!userId || get().status === "loading" || get().loadedUserId === userId)
      return;
    set({ status: "loading" });
    try {
      const data = await getProfileByID(userId);
      set({ profile: data, status: "loaded", loadedUserId: userId });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      set({ status: "loaded", loadedUserId: userId });
    }
  },
  setProfile: (profile: Profile) => set({ profile, status: "loaded" }),
  clearProfile: () =>
    set({ profile: null, status: "idle", loadedUserId: null }),
}));

export default useProfile;
