import { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Video, VideoOff } from 'lucide-react';
import { toast } from 'sonner';

interface PublishStreamProps {
  onNavigate: (screen: 'home' | 'watch' | 'publish') => void;
}

export function PublishStream({ onNavigate }: PublishStreamProps) {
  const navigate = onNavigate;
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    // Initialize camera preview
    initializeCamera();

    return () => {
      // Cleanup
      stopStreaming();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCameraReady(true);
      toast.success('Camera connected successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const startStreaming = () => {
    if (!streamRef.current) {
      toast.error('Camera not available');
      return;
    }

    try {
      // Create WebSocket connection
      // Replace with your actual WebSocket server URL
      const socket = new WebSocket('ws://localhost:8080');
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        toast.success('Connected to streaming server');
        socket.send(JSON.stringify({
        type: "init",
        role: "publisher",
        publisherId: "Hello Basit", 
        title: "My Stream"
      }));
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log("Error connecting to the host")
        toast.error('Failed to connect to streaming server');
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
      };

      // Create MediaRecorder
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm; codecs=vp8'
      });
      
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(e.data);
        }
      };

      recorder.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        toast.error('Recording error occurred');
      };

      // Start recording - send data every 200ms
      recorder.start(200);
      setIsStreaming(true);
      toast.success('Live stream started! 🔴');
    } catch (error) {
      console.error('Error starting stream:', error);
      toast.error('Failed to start streaming');
    }
  };

  const stopStreaming = () => {
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Close WebSocket
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setIsStreaming(false);
    toast.info('Stream stopped');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('home')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl">Publish Your Stream</h1>
              <p className="text-gray-600 mt-2">Share your content with the world</p>
            </div>
            {isStreaming && (
              <Badge className="bg-red-600 hover:bg-red-600 px-4 py-2 text-lg animate-pulse">
                🔴 Live
              </Badge>
            )}
          </div>
        </div>

        {/* Camera Preview Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Video Preview Area */}
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {!isCameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
                  <VideoOff className="w-16 h-16 mb-4 text-gray-500" />
                  <p>Initializing camera...</p>
                </div>
              )}
            </div>

            {/* Controls Area */}
            <div className="p-8 bg-white">
              <div className="flex flex-col items-center gap-4">
                {!isStreaming ? (
                  <Button
                    onClick={startStreaming}
                    disabled={!isCameraReady}
                    className="bg-blue-600 hover:bg-blue-700 px-12 py-6 h-auto"
                    size="lg"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Start Live
                  </Button>
                ) : (
                  <Button
                    onClick={stopStreaming}
                    variant="destructive"
                    className="px-12 py-6 h-auto"
                    size="lg"
                  >
                    <VideoOff className="w-5 h-5 mr-2" />
                    Stop Stream
                  </Button>
                )}
                
                <div className="text-center">
                  <p className="text-gray-600">
                    {isStreaming 
                      ? 'Your stream is now live and being broadcast to viewers'
                      : isCameraReady 
                        ? 'Click "Start Live" to begin broadcasting'
                        : 'Waiting for camera access...'}
                  </p>
                </div>

                {/* Technical Info */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                  <p className="text-gray-700 mb-2">Technical Setup:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Codec: VP8 (WebM)</li>
                    <li>• Frame interval: 200ms</li>
                    <li>• Protocol: WebSocket</li>
                    <li>• Camera: {isCameraReady ? 'Connected ✓' : 'Connecting...'}</li>
                    <li>• Server: {isStreaming ? 'Connected ✓' : 'Not connected'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900">
            <strong>Note:</strong> Replace <code className="bg-blue-100 px-2 py-1 rounded">wss://yourserver.com/live</code> with your actual WebSocket server URL in the PublishStream component.
          </p>
        </div>
      </div>
    </div>
  );
}