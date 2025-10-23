import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Eye } from 'lucide-react';
import { VideoPlayerOverlay } from './VideoPlayerOverlay';

interface Stream {
  id: string;
  publisherId?: string;
  title: string;
  thumbnail: string;
  viewers: number;
  streamer: string;
}

interface StreamsListProps {
  onNavigate: (screen: 'home' | 'watch' | 'publish') => void;
}

// Mock data for available streams
const mockStreams: Stream[] = [
  {
    id: '1',
    publisherId: 'streamA',
    title: 'Tech Talk: Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1620246499779-77240d92a176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwc3RyZWFtaW5nJTIwYnJvYWRjYXN0fGVufDF8fHx8MTc2MDk1ODc2M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    viewers: 342,
    streamer: 'CodeMaster'
  },
  {
    id: '2',
    publisherId: 'streamA',
    title: 'Gaming Session - Epic Adventures',
    thumbnail: 'https://images.unsplash.com/photo-1610041321024-0dff35bf9923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzdHJlYW18ZW58MXx8fHwxNzYwOTY5NjYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    viewers: 1205,
    streamer: 'GamerPro'
  },
  {
    id: '3',
    publisherId: 'streamA',
    title: 'Live Music Performance',
    thumbnail: 'https://images.unsplash.com/photo-1583778010981-15c004e805bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjA5NjMyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    viewers: 892,
    streamer: 'MusicLive'
  }
];

export function StreamsList({ onNavigate }: StreamsListProps) {
  const navigate = onNavigate;
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  
  // Change to empty array to show "no streams" state
  const streams = mockStreams;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
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
          <h1 className="text-4xl">Available Live Streams</h1>
          <p className="text-gray-600 mt-2">Watch live content from creators around the world</p>
        </div>

        {/* Streams Grid or Empty State */}
        {streams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Eye className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl mb-2">Sorry, no available livestream.</h2>
              <p className="text-gray-600">Check back later for live content</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <Card 
                key={stream.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedStream(stream)}
              >
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-600">
                    🔴 Live
                  </Badge>
                  <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-white">{stream.viewers}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1">{stream.title}</h3>
                  <p className="text-gray-600">{stream.streamer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Overlay */}
      {selectedStream && (
        <VideoPlayerOverlay
          stream={selectedStream}
          onClose={() => setSelectedStream(null)}
        />
      )}
    </div>
  );
}