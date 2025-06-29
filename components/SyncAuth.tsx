"use client"
import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

const SyncAuth = ({children} : {children : React.ReactNode}) => {
    const setUser = useAuth(state => state.setUser)
    const clearUser = useAuth(state => state.clearUser)
    

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