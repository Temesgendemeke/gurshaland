"use client"
import { useAuth } from "@/store/useAuth";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

const SyncAuth = ({children} : {children : React.ReactNode}) => {
    const setUser = useAuth(state => state.setUser)
    const clearUser = useAuth(state => state.clearUser)
    const supabase = createClient()

    useEffect(()=>{
         supabase.auth.getUser().then(({data: {user}}) => {
            if(user) setUser(user);
            else clearUser()
         })

         const {data: listener} = supabase.auth.onAuthStateChange((_event, session)=>{
            if(session?.user) setUser(session.user);
            else clearUser();
         })

         return ()=>{
            listener.subscription.unsubscribe();
         }
    }, [setUser, clearUser])


    return <>{children}</>
}

export default SyncAuth;