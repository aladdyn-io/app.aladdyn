import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { YouTubePlayer } from '@/components/ui/youtube-player';
import { Play, List, Grid, Search, ExternalLink } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

export function YouTubeDemo() {
  const [currentVideoId, setCurrentVideoId] = useState('dQw4w9WgXcQ'); // Rick Roll as default
  const [customVideoId, setCustomVideoId] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'playlist'>('single');

  // Sample playlist data
  const sampleVideos: VideoItem[] = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '3:33'
    },
    {
      id: 'jNQXAC9IVRw',
      title: 'How to create amazing UI components',
      thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      duration: '15:42'
    },
    {
      id: 'M7lc1UVf-VE',
      title: 'React Tutorial for Beginners',
      thumbnail: 'https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg',
      duration: '2:25:26'
    },
    {
      id: 'L_jWHffIx5E',
      title: 'Amazing Nature Documentary',
      thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
      duration: '52:11'
    },
    {
      id: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      duration: '4:41'
    },
  ];

  const handleVideoSelect = (videoId: string) => {
    setCurrentVideoId(videoId);
    setViewMode('single');
  };

  const handleCustomVideoLoad = () => {
    if (customVideoId.trim()) {
      // Extract video ID from URL if full URL is provided
      const videoId = extractVideoId(customVideoId);
      if (videoId) {
        setCurrentVideoId(videoId);
        setViewMode('single');
        setCustomVideoId('');
      }
    }
  };

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            YouTube Player Demo
          </h1>
          <p className="text-gray-600 text-lg">
            A modern, customizable YouTube video player with advanced controls
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Video Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Label>View Mode:</Label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'single' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('single')}
                  className={viewMode === 'single' ? 'bg-white shadow-sm' : ''}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Single
                </Button>
                <Button
                  variant={viewMode === 'playlist' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('playlist')}
                  className={viewMode === 'playlist' ? 'bg-white shadow-sm' : ''}
                >
                  <List className="w-4 h-4 mr-1" />
                  Playlist
                </Button>
              </div>
            </div>

            {/* Custom Video Input */}
            <div className="flex items-center gap-2">
              <Label htmlFor="video-url">Load Custom Video:</Label>
              <Input
                id="video-url"
                placeholder="Enter YouTube URL or Video ID"
                value={customVideoId}
                onChange={(e) => setCustomVideoId(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomVideoLoad()}
              />
              <Button onClick={handleCustomVideoLoad} size="sm">
                Load
              </Button>
            </div>

            {/* Current Video Info */}
            <div className="flex items-center gap-2">
              <Badge variant="outline">Current Video ID:</Badge>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {currentVideoId}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://youtube.com/watch?v=${currentVideoId}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open in YouTube
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className={`grid gap-6 ${viewMode === 'playlist' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {/* Video Player */}
          <div className={viewMode === 'playlist' ? 'lg:col-span-2' : ''}>
            <YouTubePlayer
              videoId={currentVideoId}
              title="YouTube Video Player"
              height="400"
              className="w-full"
              showControls={true}
              autoplay={false}
              onReady={() => console.log('YouTube player ready!')}
              onStateChange={(state) => console.log('Player state changed:', state)}
              onError={(error) => console.error('YouTube player error:', error)}
            />
          </div>

          {/* Playlist */}
          {viewMode === 'playlist' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Sample Playlist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sampleVideos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                        currentVideoId === video.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleVideoSelect(video.id)}
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/80x48?text=No+Image';
                            }}
                          />
                          <Badge className="absolute bottom-1 right-1 text-xs bg-black bg-opacity-75">
                            {video.duration}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Video ID: {video.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎮 Custom Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Play/pause, volume control, skip buttons, and fullscreen support with hover overlay.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Playback Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Adjust playback speed from 0.5x to 2x with easy-to-use settings menu.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📱 Responsive Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Fully responsive player that works great on desktop, tablet, and mobile devices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎨 Customizable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Easy to customize with props for autoplay, muted, controls, and styling.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔧 Developer Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Built with TypeScript and includes callbacks for ready, state change, and error events.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎵 Playlist Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Switch between single video and playlist view with thumbnail previews.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { YouTubePlayer } from '@/components/ui/youtube-player';

<YouTubePlayer
  videoId="dQw4w9WgXcQ"
  title="My Video"
  height="400"
  showControls={true}
  autoplay={false}
  onReady={() => console.log('Ready!')}
  onStateChange={(state) => console.log('State:', state)}
  onError={(error) => console.error('Error:', error)}
/>`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
