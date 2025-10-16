import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Slider } from './slider';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  muted?: boolean;
  showControls?: boolean;
  className?: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onError?: (error: any) => void;
}

export function YouTubePlayer({
  videoId,
  title,
  width = '100%',
  height = '315',
  autoplay = false,
  muted = false,
  showControls = true,
  className,
  onReady,
  onStateChange,
  onError,
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // YouTube player states
  const YT_PLAYER_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current && !window.ytPlayer) {
        window.ytPlayer = new window.YT.Player(playerRef.current, {
          height: height,
          width: width,
          videoId: videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            mute: muted ? 1 : 0,
            controls: showControls ? 1 : 0,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: any) => {
              setDuration(event.target.getDuration());
              onReady?.();
            },
            onStateChange: (event: any) => {
              const state = event.data;
              setIsPlaying(state === YT_PLAYER_STATES.PLAYING);
              onStateChange?.(state);
            },
            onError: (event: any) => {
              onError?.(event);
            },
          },
        });
      }
    };

    return () => {
      if (window.ytPlayer) {
        window.ytPlayer.destroy();
        window.ytPlayer = null;
      }
    };
  }, [videoId, autoplay, muted, showControls, height, width, onReady, onStateChange, onError]);

  const togglePlay = () => {
    if (window.ytPlayer) {
      if (isPlaying) {
        window.ytPlayer.pauseVideo();
      } else {
        window.ytPlayer.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (window.ytPlayer) {
      if (isMuted) {
        window.ytPlayer.unMute();
        setVolume(window.ytPlayer.getVolume());
      } else {
        window.ytPlayer.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (window.ytPlayer) {
      window.ytPlayer.setVolume(value[0]);
      setVolume(value[0]);
      if (value[0] === 0) {
        setIsMuted(true);
        window.ytPlayer.mute();
      } else if (isMuted) {
        setIsMuted(false);
        window.ytPlayer.unMute();
      }
    }
  };

  const skipBackward = () => {
    if (window.ytPlayer) {
      const currentTime = window.ytPlayer.getCurrentTime();
      window.ytPlayer.seekTo(Math.max(0, currentTime - 10));
    }
  };

  const skipForward = () => {
    if (window.ytPlayer) {
      const currentTime = window.ytPlayer.getCurrentTime();
      window.ytPlayer.seekTo(currentTime + 10);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (window.ytPlayer) {
      window.ytPlayer.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        <div ref={containerRef} className="relative group">
          {/* YouTube Embed */}
          <div className="relative">
            <iframe
              ref={playerRef}
              className="w-full"
              style={{ height: typeof height === 'number' ? `${height}px` : height }}
              title={title || 'YouTube video player'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Custom Controls Overlay */}
            {showControls && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 pointer-events-none">
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-1 bg-white bg-opacity-30 rounded-full">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={skipBackward}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={skipForward}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white hover:bg-opacity-20"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        
                        <div className="w-20">
                          <Slider
                            value={[volume]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                            className="pointer-events-auto"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Playback Rate */}
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white hover:bg-opacity-20"
                          onClick={() => setShowSettings(!showSettings)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        
                        {showSettings && (
                          <div className="absolute bottom-10 right-0 bg-black bg-opacity-90 rounded-lg p-2 space-y-1 min-w-[100px]">
                            <div className="text-xs text-gray-300 px-2 py-1">Playback Speed</div>
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-white hover:bg-opacity-20 ${
                                  playbackRate === rate ? 'text-red-500' : 'text-white'
                                }`}
                                onClick={() => changePlaybackRate(rate)}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Declare global YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    ytPlayer: any;
  }
}
