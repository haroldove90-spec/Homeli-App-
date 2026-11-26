import React, { useState } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface HomeliLauncherHomeProps {
  onOpenServices: () => void;
}

const HOMELI_LOGO_URL = 'https://daloocomercializadora.com.mx/homelilogo.png';

/** Custom Services icon designed for Homeli's deep-navy & warm-gold palette */
const ServiciosCustomIcon: React.FC = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-14 h-14 sm:w-16 sm:h-16"
    aria-hidden="true"
  >
    {/* Roof outline */}
    <path
      d="M10 29L32 11L54 29"
      stroke="#FFFFFF"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Home base walls */}
    <path
      d="M17 27V51C17 52.6569 18.3431 54 20 54H44C45.6569 54 47 52.6569 47 51V27"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Service Wrench inside the house in Homeli warm gold */}
    <path
      d="M36.8 31.2C34.4 30.2 31.5 30.8 29.7 32.6C28.1 34.2 27.6 36.5 28.2 38.6L23.6 43.2C22.8 44 22.8 45.3 23.6 46.1C24.4 46.9 25.7 46.9 26.5 46.1L31.1 41.5C33.2 42.1 35.5 41.6 37.1 40C38.9 38.2 39.5 35.3 38.5 32.9L35.4 36L33.7 34.3L36.8 31.2Z"
      fill="#F2B84B"
    />
    {/* Accent sparkle */}
    <path
      d="M48 13L49.2 16.3L52.5 17.5L49.2 18.7L48 22L46.8 18.7L43.5 17.5L46.8 16.3L48 13Z"
      fill="#F2B84B"
    />
  </svg>
);

export const HomeliLauncherHome: React.FC<HomeliLauncherHomeProps> = ({ onOpenServices }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showMobileInstallGuide, setShowMobileInstallGuide] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleInstallPress = async () => {
    if (isInstallable) {
      const result = await install();
      if (result === 'unavailable') {
        setShowMobileInstallGuide(true);
      }
    } else {
      setShowMobileInstallGuide(true);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#000E2B] text-white flex flex-col items-center justify-between px-6 py-10 sm:py-12 select-none">
      {/* Main Centered Content */}
      <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center gap-8 sm:gap-9">
        {/* Top Homeli Logo */}
        <div className="w-52 sm:w-60 flex items-center justify-center">
          {!logoError ? (
            <img
              src={HOMELI_LOGO_URL}
              alt="Homeli — Servicios de Estilo de Vida"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="w-full h-auto object-contain"
            />
          ) : (
            <img
              src="/pwa-512x512.png"
              alt="Homeli"
              className="w-36 h-36 object-contain"
            />
          )}
        </div>

        {/* Tagline */}
        <h1 className="text-center text-xl sm:text-2xl font-normal tracking-wide leading-snug text-white/95 text-balance">
          Tu vida más fácil,
          <br />
          en una sola app
        </h1>

        {/* Single Centered Access Tile: Servicios (without the extra "Servicios:" heading above) */}
        <section className="w-full flex flex-col items-center gap-6 pt-1">
          <button
            type="button"
            onClick={onOpenServices}
            className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl border border-white/85 bg-[#00143B]/75 hover:bg-[#001C52]/90 active:scale-[0.97] transition-all duration-150 flex flex-col items-center justify-center gap-3 p-4 shadow-xl shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
            aria-label="Abrir sección de Servicios"
          >
            <ServiciosCustomIcon />
            <span className="text-sm font-medium tracking-wide text-white/95 whitespace-nowrap">
              Servicios
            </span>
          </button>

          {/* Mobile App Install Button (Hidden automatically once installed as standalone app) */}
          {!isInstalled && (
            <div className="w-full max-w-[300px] sm:max-w-[320px] pt-1">
              <button
                type="button"
                onClick={handleInstallPress}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-white text-[#000E2B] hover:bg-slate-100 active:scale-[0.98] transition-all duration-150 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
              >
                {isInstallable ? (
                  <Download className="w-4 h-4 shrink-0" />
                ) : (
                  <Smartphone className="w-4 h-4 shrink-0" />
                )}
                <span className="whitespace-nowrap">Instalar App en tu celular</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Indicator Bar */}
      <footer className="pt-8 pb-2 flex items-center justify-center">
        <div
          className="w-36 h-1.5 rounded-full bg-[#4A6185] overflow-hidden"
          aria-hidden="true"
        >
          <div className="w-1/2 h-full bg-white rounded-full" />
        </div>
      </footer>

      {/* Modal: Mobile Installation Guide (iOS Safari / Android Chrome fallback when native prompt is unavailable) */}
      {showMobileInstallGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowMobileInstallGuide(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#041842] border border-white/20 p-6 text-white shadow-2xl space-y-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowMobileInstallGuide(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 pr-10">
              <img
                src="/pwa-192x192.png"
                alt="Icono Homeli"
                className="w-12 h-12 rounded-2xl object-cover border border-white/15 shrink-0"
              />
              <div>
                <h3 id="install-guide-title" className="text-base font-semibold text-white">
                  Instalar Homeli
                </h3>
                <p className="text-xs text-slate-300">
                  Instala la app en tu celular sin tiendas
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {(!isAndroid || isIOS) && (
                <div className="p-4 rounded-2xl bg-[#000E2B]/80 border border-white/15 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <Share className="w-4 h-4 text-[#F2B84B] shrink-0" />
                    <span>En iPhone (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <li>
                      Toca el botón <strong className="text-white">Compartir</strong> en la barra inferior de Safari.
                    </li>
                    <li>
                      Desliza y selecciona <strong className="text-white">Agregar a pantalla de inicio</strong>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline text-[#F2B84B]" />.
                    </li>
                    <li>
                      Toca <strong className="text-white">Agregar</strong> para instalar la app Homeli.
                    </li>
                  </ol>
                </div>
              )}

              {(!isIOS || isAndroid) && (
                <div className="p-4 rounded-2xl bg-[#000E2B]/80 border border-white/15 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <Smartphone className="w-4 h-4 text-[#F2B84B] shrink-0" />
                    <span>En Android (Chrome)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <li>
                      Abre este enlace en <strong className="text-white">Google Chrome</strong> en tu celular.
                    </li>
                    <li>
                      Toca el menú <MoreVertical className="w-3.5 h-3.5 inline text-[#F2B84B]" /> arriba a la derecha.
                    </li>
                    <li>
                      Selecciona <strong className="text-white">Instalar aplicación</strong> y confirma.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowMobileInstallGuide(false)}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white text-[#000E2B] hover:bg-slate-100 active:scale-[0.98] transition-all font-semibold text-sm"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
