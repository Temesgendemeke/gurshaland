import React from "react";

interface YoutubeVideoSectionProps {
  videoId?: string;
  videoQuery?: string;
}

const YoutubeVideoSection: React.FC<YoutubeVideoSectionProps> = ({
  videoId,
  videoQuery,
}) => {
  if (!videoId) {
    return null;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
        <h3 className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Video Tutorial
        </h3>
        {videoQuery && (
          <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate max-w-[240px]">
            {videoQuery}
          </span>
        )}
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
        <iframe
          className="h-full w-full border-0"
          src={embedUrl}
          title={videoQuery ? `${videoQuery} video tutorial` : "Recipe video player"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
};

export default YoutubeVideoSection;


