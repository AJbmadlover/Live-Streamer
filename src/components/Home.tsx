import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Video, PlayCircle } from 'lucide-react';

interface HomeProps {
  onNavigate: (screen: 'home' | 'watch' | 'publish') => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4">Live Streaming Platform</h1>
          <p className="text-gray-600">Broadcast your stream or watch live content</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Go Live Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Video className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">📹 Go Live</CardTitle>
              <CardDescription>Start broadcasting your own live stream</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button 
                onClick={() => onNavigate('publish')}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-6 h-auto"
                size="lg"
              >
                Start Publishing
              </Button>
            </CardContent>
          </Card>

          {/* Watch Streams Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-purple-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">🎥 Watch Live Streams</CardTitle>
              <CardDescription>Browse and watch available live streams</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button 
                onClick={() => onNavigate('watch')}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-6 h-auto"
                size="lg"
              >
                View Streams
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}