import React, { useState, useCallback } from 'react';
import { WifiOff } from 'lucide-react';
import { SplashScreen } from './components/home/SplashScreen';
import { HomeliLauncherHome } from './components/home/HomeliLauncherHome';
import { KicksXRAppView } from './components/home/KicksXRAppView';
import { useOnlineStatus } from './hooks/usePWAInstall';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isKicksXROpen, setIsKicksXROpen] = useState(false);
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

      {/* Main Homeli Home (#000E2B) */}
      <HomeliLauncherHome onOpenKicksXR={() => setIsKicksXROpen(true)} />

      {/* Fullscreen Embedded Kicks XR App View */}
      {isKicksXROpen && (
        <KicksXRAppView onBack={() => setIsKicksXROpen(false)} />
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
