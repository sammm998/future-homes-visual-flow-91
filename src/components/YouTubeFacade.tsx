import React, { useState, useCallback } from 'react';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  className?: string;
  thumbnailQuality?: 'default' | 'hq' | 'mq' | 'sd' | 'maxres';
}

export const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({
  videoId,
  title,
  className = '',
  thumbnailQuality = 'hq'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePlay = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}default.jpg`;

  if (isLoaded) {
    return (
      <iframe
        className={className}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlay();
        }
      }}
    >
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="bg-red-600 rounded-full p-4 group-hover:bg-red-700 transition-colors shadow-lg">
          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
        </div>
      </div>
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white font-medium text-sm sm:text-base line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default YouTubeFacade;