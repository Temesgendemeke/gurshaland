import React from "react";

const YoutubeVideoSection = ({
  videoId,
  videoQuery,
}: {
  videoId?: string;
  videoQuery?: string;
}) => {
  // Don't render anything if no videoId is provided
  if (!videoId) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight text-foreground">
        Watch {videoQuery || "this recipe"} tutorial video
      </h3>
      <div className="relative w-full h-0 pb-[56.25%]">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default YoutubeVideoSection;
