import React, { useState, useEffect } from "react";
import { Download, Smartphone, X, CheckCircle, Share, PlusSquare } from "lucide-react";

interface PWAInstallButtonProps {
  variant?: "header" | "modal" | "banner";
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = "header", className = "" }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (already installed)
    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show PWA installation guide modal for iOS or manual install
      setShowInstructionsModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold ${className}`}>
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>App Instalada</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-sm hover:shadow-md hover:opacity-95 active:scale-95 transition-all ${className}`}
        title="Instalar Homeli en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span className="text-[11px] font-medium">Instalar App</span>
      </button>

      {/* PWA Installation Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4 relative">
            
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pr-6">
              <img
                src="https://ejmuvdsqpbfnqzodxkgg.supabase.co/storage/v1/object/public/graficos/homeliicono.png"
                alt="Homeli Icon"
                className="w-12 h-12 rounded-2xl shadow-md border border-slate-100 object-cover"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                  Instalar Homeli
                </h3>
                <p className="text-xs text-slate-500">Super App & Marketplace</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              Añade Homeli a tu pantalla de inicio para acceder rápidamente sin descargas pesadas.
            </p>

            {/* Instructions list */}
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100 space-y-1">
                <div className="font-bold text-violet-950 flex items-center gap-2">
                  <Share className="w-4 h-4 text-violet-600" />
                  <span>En iPhone / iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1 text-[11px]">
                  <li>Toca el botón <strong>Compartir</strong> en la barra de Safari.</li>
                  <li>Selecciona <strong>"Agregar a inicio"</strong> <PlusSquare className="w-3 h-3 inline text-violet-600" />.</li>
                </ol>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-950 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>En Android / Chrome / Computadora</span>
                </div>
                <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1 text-[11px]">
                  <li>Toca los <strong>3 puntos de menú</strong> del navegador.</li>
                  <li>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla principal"</strong>.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Entendido
            </button>

          </div>
        </div>
      )}
    </>
  );
};
