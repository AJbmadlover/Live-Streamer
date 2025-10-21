import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Play, Pause, SkipForward } from 'lucide-react';

interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  viewers: number;
  streamer: string;
}

interface VideoPlayerOverlayProps {
  stream: Stream;
  onClose: () => void;
}

export function VideoPlayerOverlay({ stream, onClose }: VideoPlayerOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // In a real implementation, you would connect to the WebSocket stream here
    // For demo purposes, we're using the thumbnail as a poster
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{stream.title}</DialogTitle>
          <p className="text-gray-600">by {stream.streamer}</p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full"
              poster={stream.thumbnail}
            >
              {/* In a real app, you would add a source from your WebSocket stream */}
              <source src="#" type="video/webm" />
            </video>
            
            {/* Overlay message for demo */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <p className="mb-2">🔴 Live Stream</p>
                <p>Connect to WebSocket stream to view live content</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>
            <Button
              onClick={handleForward}
              variant="outline"
              size="lg"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Forward 10s
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
