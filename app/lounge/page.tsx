import BackNavigation from '@/components/BackNavigation'
import { Header } from '@/components/header'
import React from 'react'

const page = () => {
  return (
    <>
       <Header/>

       <div>
           <BackNavigation/>

           {/* hero text */}
           <div>
            <div className="py-16 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                    The Hottest Lounge Search Engine
                </h1>
                <p className="mt-4 text-lg md:text-2xl text-gray-600">
                    Discover, compare, and book lounges instantly.
                </p>

                <p></p>
            </div>
           </div>
       </div>
    </>
  )
}

export default page