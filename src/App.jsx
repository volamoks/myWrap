import { useState, useEffect } from 'react';
import PinScreen from './components/PinScreen';
import StoryContainer from './components/StoryContainer';
import AdminPage from './components/AdminPage';
import { decodeConfig } from './utils/encoding';
import Snowfall from './components/Snowfall';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [urlData, setUrlData] = useState(null);
  const [mode, setMode] = useState('loading'); // 'loading', 'admin', 'viewer'

  const [requiredPin, setRequiredPin] = useState(null); // New state for dynamic PIN

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataString = params.get('d');

    if (dataString) {
      const decoded = decodeConfig(dataString);
      if (decoded) {
        // Handle new format { pin, stories } vs old format [stories]
        if (decoded.pin && decoded.stories) {
          setRequiredPin(decoded.pin);
          setUrlData(decoded.stories);
        } else {
          // Legacy / Old format support
          setUrlData(decoded);
          setRequiredPin('2024'); // Default fallback
        }
        setMode('viewer');
      } else {
        setMode('admin');
      }
    } else {
      setMode('admin');
    }
  }, []);

  if (mode === 'loading') return null;

  if (mode === 'admin') {
    return <AdminPage />;
  }

  // Viewer Mode
  return (
    <main className="fixed inset-0 overflow-hidden bg-pastel-cream">
      {!isUnlocked ? (
        <PinScreen
          correctPin={requiredPin || '2024'}
          onUnlock={() => setIsUnlocked(true)}
        />
      ) : (
        <StoryContainer storiesData={urlData} />
      )}
    </main>
  );
}

export default App;
