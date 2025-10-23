import ImageBoxSkeleton from '@/components/skeleton/ImageBoxSkeleton';
import { AIRecipeInstruction } from '@/utils/types/recipe';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const InstructionsSection = ({instructions}:{instructions: AIRecipeInstruction[]}) => {
  return (
    <div className="space-y-4 mt-4">
                  <h3 className="text-xl font-semibold text-body border-b border-slate-200 dark:border-slate-700 pb-3">
                    Instructions
                  </h3>
                  <div className="flex flex-col gap-6">
                    {instructions?.map(
                      (
                        instruction,
                        idx: number
                      ) => {
                        return (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-lg font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1 pt-2 flex gap-5 items-start">
                              <div className="relative w-96   h-96 mb-4  rounded-lg">
                                {instruction?.image?.url ? <Image
                                  src={
                                    instruction?.image?.url 
                                  }
                                  alt={instruction.title}
                                  fill
                                  className="object-cover w-full h-full rounded-lg"
                                /> : (<ImageBoxSkeleton/>)}
                                {instruction?.isLoading && (
                                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-lg">
                                    <div className="flex flex-col items-center gap-2">
                                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Generating image...
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className='space-y-2'>
                              <p className="text-body leading-relaxed md:text-2xl font-bold">
                                {instruction.title}
                              </p>
                              <p className="text-body-muted text-sm max-w-xl">
                                {instruction.description}
                              </p>
                              <p className="text-body-muted text-sm">
                                {instruction.tips}
                              </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
  )
}

export default InstructionsSection