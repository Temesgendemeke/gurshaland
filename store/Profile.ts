import { create } from "zustand";
import { Profile } from "@/utils/types/Settings";

interface ProfileType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
}

const useProfile = create<ProfileType>((set) => ({
  profile: null,
  setProfile: (profile: Profile) => set({ profile }),
}));

export default useProfile;
