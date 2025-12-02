"use client"
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const notfound = () => {
  const router = useRouter();
  return (
    <div className=' flex flex-col items-center justify-center h-screen'>
      <h1 className="text-5xl md:text-7xl font-bold text-red-400 tracking-widest drop-shadow-lg">
        404 
      </h1>
      <p className="text-xl md:text-2xl text-gray-400 mt-4">
        Oops! The page you are looking for does not exist.
      </p>
      <Button
        onClick={() => router.back()}
        className="mt-8 px-8 py-3 bg-background border-foreground border rounded-full font-bold shadow-lg transition-all duration-300"
      >
        Go Back
      </Button>
    </div>
  )
}

export default notfound