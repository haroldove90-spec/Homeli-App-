import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface KicksXRAppViewProps {
  onBack: () => void;
}

const KICKS_XR_URL = 'https://kicks-xr.vercel.app/';
const KICKS_XR_LOGO_URL = 'https://daloocomercializadora.com.mx/kicksxrlogo.png';

export const KicksXRAppView: React.FC<KicksXRAppViewProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-[#000E2B] flex flex-col w-full h-[100dvh] overflow-hidden">
      {/* Discrete floating back control to return to Homeli Home without adding a browser header */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Volver a Homeli"
        className="fixed top-3 left-3 z-50 min-h-[44px] min-w-[44px] px-3.5 rounded-full bg-[#000E2B]/80 hover:bg-[#000E2B] text-white border border-white/25 backdrop-blur-md shadow-lg flex items-center gap-1.5 text-xs font-medium active:scale-95 transition-all"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="whitespace-nowrap">Homeli</span>
      </button>

      {/* Initial loading cover while embedded app initializes */}
      {!isLoaded && (
        <div className="absolute inset-0 z-40 bg-[#000E2B] flex flex-col items-center justify-center gap-5 px-6">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-xl max-w-[220px] w-full flex items-center justify-center">
            <img
              src={KICKS_XR_LOGO_URL}
              alt="Kicks XR"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="w-32 h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-1/2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Embedded fullscreen mobile app experience (no browser address bar) */}
      <iframe
        src={KICKS_XR_URL}
        title="Kicks XR"
        onLoad={() => setIsLoaded(true)}
        allow="camera; microphone; xr-spatial-tracking; gyroscope; accelerometer; fullscreen; geolocation; autoplay; clipboard-write"
        allowFullScreen
        className="w-full flex-1 border-0 bg-[#000E2B]"
      />
    </div>
  );
};
