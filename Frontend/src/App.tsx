import { useState } from 'react';
import { Toaster } from 'sonner';
import { Home } from './components/Home';
import { StreamsList } from './components/StreamsList';
import { PublishStream } from './components/PublishStream';

type Screen = 'home' | 'watch' | 'publish';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={setCurrentScreen} />;
      case 'watch':
        return <StreamsList onNavigate={setCurrentScreen} />;
      case 'publish':
        return <PublishStream onNavigate={setCurrentScreen} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
      <Toaster />
    </div>
  );
}