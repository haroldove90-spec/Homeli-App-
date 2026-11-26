import React, { useState, useCallback } from 'react';
import { WifiOff } from 'lucide-react';
import { SplashScreen } from './components/home/SplashScreen';
import { HomeliLauncherHome } from './components/home/HomeliLauncherHome';
import { ServicesHubView } from './components/home/ServicesHubView';
import { KicksXRAppView } from './components/home/KicksXRAppView';
import { useOnlineStatus } from './hooks/usePWAInstall';

type AppScreen = 'home' | 'services' | 'kicks-xr';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const isOnline = useOnlineStatus();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#000E2B] text-white relative">
      {/* 4.5s Splash Screen */}
      {showSplash && (
        <SplashScreen durationMs={4500} onComplete={handleSplashComplete} />
      )}

      {/* Screen 1: Main Homeli Home (#000E2B) */}
      {activeScreen === 'home' && (
        <HomeliLauncherHome onOpenServices={() => setActiveScreen('services')} />
      )}

      {/* Screen 2: Services Hub (Kicks XR, Bomba de agua, Gas a domicilio) */}
      {activeScreen === 'services' && (
        <ServicesHubView
          onBack={() => setActiveScreen('home')}
          onOpenKicksXR={() => setActiveScreen('kicks-xr')}
        />
      )}

      {/* Screen 3: Fullscreen Embedded Kicks XR App View */}
      {activeScreen === 'kicks-xr' && (
        <KicksXRAppView onBack={() => setActiveScreen('services')} />
      )}

      {/* Offline Connectivity Indicator */}
      {!isOnline && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg whitespace-nowrap"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>Sin conexión — Modo offline activo</span>
        </div>
      )}
    </div>
  );
}
