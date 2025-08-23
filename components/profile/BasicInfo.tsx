"use client";
import React from "react";
import avatar from "@/public/avater.webp";
import { Button } from "../ui/button";
import { useAuth } from "@/store/useAuth";
import { Profile } from "@/utils/types/profile";
import { useRouter } from "next/navigation";


interface BasicInfoProps{
  profile: Profile;
}

const BasicInfo = ({ profile }:BasicInfoProps) => {
  const user = useAuth((store) => store.user);
  const router = useRouter()


  const handleFollow = (
  )=>{
    if(!user) return router.push('/login')

      
  }
  return (
    <>
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
        <img
          src={`${profile.avatar_url || avatar.src}`}
          alt={`${profile.username} avatar`}
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-primary">
        {profile.username}
      </h2>
      <Button
        aria-disabled={user?.id == profile.id}
        disabled={user?.id === profile.id}
        onClick={handleFollow}
        className="mt-2 px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition"
      >
        Follow
      </Button>
    </>
  );
};

export default BasicInfo;
