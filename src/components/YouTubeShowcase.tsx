import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { YouTubePlayer } from '@/components/ui/youtube-player';
import { YouTubePlaylist, createPlaylistFromVideoIds } from '@/components/ui/youtube-playlist';
import { Play, Grid, List, Settings } from 'lucide-react';

interface YouTubeShowcaseProps {
  className?: string;
}

export function YouTubeShowcase({ className }: YouTubeShowcaseProps) {
  const [viewMode, setViewMode] = useState<'single' | 'playlist'>('single');
  const [currentVideo, setCurrentVideo] = useState('dQw4w9WgXcQ');

  // Sample videos for showcase
  const sampleVideos = createPlaylistFromVideoIds(
    ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'M7lc1UVf-VE', 'L_jWHffIx5E'],
    [
      'Rick Astley - Never Gonna Give You Up',
      'How to create amazing UI components',
      'React Tutorial for Beginners',
      'Amazing Nature Documentary'
    ],
    ['Rick Astley', 'UI Tutorials', 'React Channel', 'Nature Docs']
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          YouTube Integration
        </h2>
        <p className="text-gray-600">
          Modern YouTube video player with custom controls and playlist support
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'single' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('single')}
            className={viewMode === 'single' ? 'bg-white shadow-sm' : ''}
          >
            <Play className="w-4 h-4 mr-2" />
            Single Video
          </Button>
          <Button
            variant={viewMode === 'playlist' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('playlist')}
            className={viewMode === 'playlist' ? 'bg-white shadow-sm' : ''}
          >
            <List className="w-4 h-4 mr-2" />
            Playlist
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={`grid gap-6 ${viewMode === 'playlist' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Video Player */}
        <div className={viewMode === 'playlist' ? 'lg:col-span-2' : ''}>
          <YouTubePlayer
            videoId={currentVideo}
            title="YouTube Video Player"
            height="400"
            showControls={true}
            autoplay={false}
            className="w-full"
          />
        </div>

        {/* Playlist */}
        {viewMode === 'playlist' && (
          <YouTubePlaylist
            videos={sampleVideos}
            currentVideoId={currentVideo}
            onVideoSelect={setCurrentVideo}
            showControls={true}
            className="h-fit"
          />
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="text-2xl mb-2">🎮</div>
            <CardTitle className="text-sm">Custom Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Play, pause, volume, skip, and fullscreen controls
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="text-2xl mb-2">⚡</div>
            <CardTitle className="text-sm">Playback Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Adjust speed from 0.5x to 2x
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="text-2xl mb-2">📱</div>
            <CardTitle className="text-sm">Responsive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Works on all device sizes
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="text-2xl mb-2">🎵</div>
            <CardTitle className="text-sm">Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Queue and manage multiple videos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentVideo('dQw4w9WgXcQ')}
          className={currentVideo === 'dQw4w9WgXcQ' ? 'bg-red-50 border-red-500' : ''}
        >
          Rick Roll
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentVideo('jNQXAC9IVRw')}
          className={currentVideo === 'jNQXAC9IVRw' ? 'bg-red-50 border-red-500' : ''}
        >
          UI Tutorial
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentVideo('M7lc1UVf-VE')}
          className={currentVideo === 'M7lc1UVf-VE' ? 'bg-red-50 border-red-500' : ''}
        >
          React Tutorial
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentVideo('L_jWHffIx5E')}
          className={currentVideo === 'L_jWHffIx5E' ? 'bg-red-50 border-red-500' : ''}
        >
          Nature Doc
        </Button>
      </div>
    </div>
  );
}
