"use client"
import { getBlogBySlug } from "@/actions/blog/blog"
import BackNavigation from "@/components/BackNavigation"
import BlogForm from "@/components/blog/BlogForm"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import React, { useEffect, useState } from "react"
import { useAuth } from "@/store/useAuth"
import { useParams } from "next/navigation"
import { useBlogDetailStore } from "@/store/BlogDetail"

function Page(): React.JSX.Element {
    const param = useParams()
    const user = useAuth((store)=>store.user)
    const fetchBlog = useBlogDetailStore((store) => store.fetchBlog)
    const blog = useBlogDetailStore((store) => store.blog)

    useEffect(()=>{
        if(user?.id){
            fetchBlog(param.slug as string, user.id)
        }

        console.log("blogdetail ", blog)
    },[user?.id, param.slug])

   return(
    <>
       <Header/>

       <div className="mx-auto px-10 py-12 space-y-8">
        <BackNavigation/>
        {user?.id}
        {JSON.stringify(blog)}
        
        <div>
            <BlogForm blog={blog} mode="update"/>
        </div>
        <div>    
        </div>  
        <Footer/>
       </div>
    </>
   )   
}


export default Page;