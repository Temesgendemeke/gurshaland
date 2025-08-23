"use client";
import React, { useEffect, useState } from "react";
import FollowerColumn from "@/components/dashboard/FollowerColumn";
import { FollowerColumnType } from "@/utils/types/Dashboard";
import { DataTable } from "@/components/data-table";
import { get_followers } from "@/actions/followers/follower";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";

const page = () => {
  const [followers, setFollowers] = useState([]);
  const user_id = useAuth((store) => store.user?.id);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        if (user_id) {
          const data = await get_followers(user_id as string);
          setLoading(false);
          setFollowers(data);
        }
      } catch (error) {
        toast.error(generate_error(error));
      }
    })();
  }, [user_id]);

  return (
    <div className="mx-5 md:mx-10">
      <div className="mt-4 text-center md:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Your Followers
        </h2>
        <p className="mb-4 sm:mb-6 text-gray-600 max-w-full text-sm sm:text-base">
          Here's a summary of everyone following you. See when they started, how
          they interact, and connect with your community!
        </p>
      </div>
      <div className="overflow-x-visible w-full px-2 sm:px-4 md:px-0">
        <DataTable<FollowerColumnType, any>
          columns={FollowerColumn}
          data={followers}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default page;
