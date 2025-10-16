import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaylistItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel?: string;
}

interface YouTubePlaylistProps {
  videos: PlaylistItem[];
  currentVideoId?: string;
  onVideoSelect: (videoId: string) => void;
  className?: string;
  showControls?: boolean;
  shuffle?: boolean;
  repeat?: boolean;
  onShuffle?: () => void;
  onRepeat?: () => void;
}

export function YouTubePlaylist({
  videos,
  currentVideoId,
  onVideoSelect,
  className,
  showControls = true,
  shuffle = false,
  repeat = false,
  onShuffle,
  onRepeat,
}: YouTubePlaylistProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleVideoClick = (videoId: string, index: number) => {
    setCurrentIndex(index);
    onVideoSelect(videoId);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(nextIndex);
    onVideoSelect(videos[nextIndex].id);
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onVideoSelect(videos[prevIndex].id);
  };

  const handleShuffle = () => {
    onShuffle?.();
  };

  const handleRepeat = () => {
    onRepeat?.();
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Playlist</CardTitle>
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant={shuffle ? 'default' : 'outline'}
                size="sm"
                onClick={handleShuffle}
                className="h-8 w-8 p-0"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button
                variant={repeat ? 'default' : 'outline'}
                size="sm"
                onClick={handleRepeat}
                className="h-8 w-8 p-0"
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        {showControls && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={videos.length <= 1}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={videos.length <= 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {videos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="text-4xl mb-2">🎵</div>
              <p>No videos in playlist</p>
            </div>
          ) : (
            <div className="space-y-1">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={cn(
                    'p-3 cursor-pointer transition-all hover:bg-gray-50 border-l-4',
                    currentVideoId === video.id
                      ? 'bg-red-50 border-red-500'
                      : 'border-transparent hover:border-gray-300',
                    index === currentIndex && 'bg-blue-50'
                  )}
                  onClick={() => handleVideoClick(video.id, index)}
                >
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/64x48?text=No+Image';
                        }}
                      />
                      <Badge className="absolute bottom-0 right-0 text-xs bg-black bg-opacity-75">
                        {video.duration}
                      </Badge>
                      {currentVideoId === video.id && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                        {video.title}
                      </h4>
                      {video.channel && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {video.channel}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          #{index + 1}
                        </span>
                        {currentVideoId === video.id && (
                          <Badge variant="destructive" className="text-xs">
                            Now Playing
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Utility function to create playlist items from YouTube video IDs
export function createPlaylistFromVideoIds(
  videoIds: string[],
  titles?: string[],
  channels?: string[]
): PlaylistItem[] {
  return videoIds.map((id, index) => ({
    id,
    title: titles?.[index] || `Video ${index + 1}`,
    thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    duration: '0:00', // Duration would need to be fetched from YouTube API
    channel: channels?.[index],
  }));
}
