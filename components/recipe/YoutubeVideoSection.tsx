import React from 'react'

const YoutubeVideoSection = ({ videoId, videoQuery }: { videoId?: string, videoQuery?: string }) => {
  // Don't render anything if no videoId is provided
  if (!videoId) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-xl font-semibold text-body border-b border-slate-200 dark:border-slate-700 pb-3">
        Watch {videoQuery || 'this recipe'} tutorial video
      </h3>
      <div className="relative w-full h-0 pb-[56.25%] mt-4">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}

export default YoutubeVideoSection