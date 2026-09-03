"use client"
import { useAuth } from "@/store/useAuth";
import useProfile from "@/store/Profile";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

const SyncAuth = ({children} : {children : React.ReactNode}) => {
    const setUser = useAuth(state => state.setUser)
    const clearUser = useAuth(state => state.clearUser)
    const fetchProfile = useProfile(state => state.fetchProfile)
    const clearProfile = useProfile(state => state.clearProfile)
    const supabase = createClient()

    useEffect(()=>{
         supabase.auth
            .getUser()
            .then(({ data: { user } }) => {
              if (user) {
                setUser(user);
                fetchProfile(user.id);
              } else {
                clearUser();
                clearProfile();
              }
            })
            .catch((err) => {
              console.warn("Could not sync user session:", err?.message || err);
              clearUser();
              clearProfile();
            });

         const {data: listener} = supabase.auth.onAuthStateChange((_event, session)=>{
            if(session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            } else {
                clearUser();
                clearProfile();
            }
         })

         return ()=>{
            listener.subscription.unsubscribe();
         }
    }, [setUser, clearUser, fetchProfile, clearProfile])


    return <>{children}</>
}

export default SyncAuth;
