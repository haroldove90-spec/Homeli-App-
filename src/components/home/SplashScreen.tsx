import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

const SPLASH_IMAGE_URL = 'https://daloocomercializadora.com.mx/homelisplash.png';

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 4500,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, durationMs);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, durationMs + 450);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [durationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000E2B] overflow-hidden transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-label="Cargando Homeli"
    >
      {!imageError ? (
        <img
          src={SPLASH_IMAGE_URL}
          alt="Homeli Splash"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover sm:object-contain select-none"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 px-8 text-center">
          <img
            src="/pwa-512x512.png"
            alt="Homeli"
            className="w-32 h-32 object-contain"
          />
          <p className="text-2xl font-semibold tracking-wide text-white">Homeli</p>
        </div>
      )}

      {/* Subtle bottom loading progress bar */}
      <div className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 w-36 h-1 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full w-full bg-white rounded-full animate-splash-progress" />
      </div>
    </div>
  );
};
