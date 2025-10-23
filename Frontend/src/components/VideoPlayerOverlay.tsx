import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Play, Pause, SkipForward } from 'lucide-react';
import { toast } from 'sonner';

interface Stream {
  id: string;
  publisherId?: string;
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
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!stream) return;

    const controller = new AbortController();
    let didCancel = false;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const setup = async () => {
      const publisherId = stream.publisherId ?? stream.id;
      if (!publisherId) {
        toast.error('No publisher ID available for this stream');
        return;
      }

      try {
        const resp = await fetch("http://localhost:8080/video-url/streamA", {
          signal: controller.signal,
        });

        if (resp.status === 404) {
          toast.error('Publisher live stream not found');
          return;
        }

        if (!resp.ok) {
          toast.error('Failed to get video URL from server');
          return;
        }

        const j = await resp.json();
        const src = j && (j.url || j.src || null);
        if (!src || didCancel) return;

        setVideoSrc(src);

        if (videoRef.current) {
          videoRef.current.autoplay = true;
          videoRef.current.playsInline = true;
          videoRef.current.addEventListener('play', onPlay);
          videoRef.current.addEventListener('pause', onPause);
          try {
            await videoRef.current.play();
          } catch (e) {
            console.warn('Autoplay blocked:', e);
          }
        }
      } catch (err) {
        if ((err as any).name === 'AbortError') return;
        console.error('Error fetching video URL', err);
        toast.error('Error retrieving stream from server');
      }
    };

    setup();

    return () => {
      didCancel = true;
      try {
        controller.abort();
      } catch (e) {}
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', onPlay);
        videoRef.current.removeEventListener('pause', onPause);
        try {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        } catch (e) {}
      }
      setVideoSrc(null);
      setIsPlaying(false);
    };
  }, [stream]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
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
              src={videoSrc ?? undefined}
              controls
            />
            {/* Overlay message only if no videoSrc */}
            {!videoSrc && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <p className="mb-2">🔴 Live Stream</p>
                  <p>Connecting to stream...</p>
                </div>
              </div>
            )}
          </div>
          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="lg"
              disabled={!videoSrc}
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
              disabled={!videoSrc}
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
