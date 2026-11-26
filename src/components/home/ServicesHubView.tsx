import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Clock } from 'lucide-react';

interface ServicesHubViewProps {
  onBack: () => void;
  onOpenKicksXR: () => void;
}

const HOMELI_LOGO_URL = 'https://daloocomercializadora.com.mx/homelilogo.png';
const KICKS_XR_LOGO_URL = 'https://daloocomercializadora.com.mx/kicksxrlogo.png';

/** Custom Water Pump icon matching the client diagram (pump housing + water droplet) */
const BombaAguaIcon: React.FC = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 sm:w-14 sm:h-14 shrink-0"
    aria-hidden="true"
  >
    {/* Top cap / pressure port */}
    <path
      d="M27 14H41M30 14V20M38 14V20"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left intake nozzle */}
    <rect
      x="8"
      y="28"
      width="8"
      height="12"
      rx="2"
      stroke="#FFFFFF"
      strokeWidth="2.8"
    />
    <path d="M16 34H20" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    {/* Pump motor main body */}
    <rect
      x="20"
      y="20"
      width="32"
      height="28"
      rx="7"
      stroke="#FFFFFF"
      strokeWidth="2.8"
    />
    {/* Cooling vents on right side */}
    <path
      d="M42 28H47M42 34H47M42 40H47"
      stroke="#FFFFFF"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    {/* Mounting feet */}
    <path
      d="M26 48L23 54H29M46 48L49 54H43"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Water droplet in center (lime/gold accent from client diagram) */}
    <path
      d="M31.5 26.5C31.5 26.5 25.5 33.4 25.5 37.2C25.5 40.5 28.2 43.2 31.5 43.2C34.8 43.2 37.5 40.5 37.5 37.2C37.5 33.4 31.5 26.5 31.5 26.5Z"
      fill="#A3E635"
      stroke="#A3E635"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="37.5" r="1.4" fill="#000E2B" />
  </svg>
);

/** Custom Home Gas Tank icon matching the client diagram (gas cylinder + valve + flame) */
const GasDomicilioIcon: React.FC = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 sm:w-14 sm:h-14 shrink-0"
    aria-hidden="true"
  >
    {/* Top collar / handle */}
    <path
      d="M23 11H41M25 11V19M39 11V19"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Valve stem */}
    <path
      d="M32 14V19M29 15H35"
      stroke="#FFFFFF"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    {/* Gas cylinder tank body */}
    <rect
      x="16"
      y="19"
      width="32"
      height="31"
      rx="9"
      stroke="#FFFFFF"
      strokeWidth="2.8"
    />
    {/* Base rim */}
    <path
      d="M22 50V54H42V50"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Flame emblem in center */}
    <path
      d="M32 25.5C32 25.5 38.5 31.5 38.5 37.2C38.5 40.8 35.6 43.7 32 43.7C28.4 43.7 25.5 40.8 25.5 37.2C25.5 34.4 27.3 31.8 28.8 30.2C28.8 32.1 29.8 33.2 30.8 33.6C30.4 30.8 31.1 27.6 32 25.5Z"
      fill="#A3E635"
    />
    <path
      d="M32 34.8C32 34.8 34.6 37.2 34.6 39.2C34.6 40.6 33.4 41.8 32 41.8C30.6 41.8 29.4 40.6 29.4 39.2C29.4 37.2 32 34.8 32 34.8Z"
      fill="#F2B84B"
    />
  </svg>
);

export const ServicesHubView: React.FC<ServicesHubViewProps> = ({
  onBack,
  onOpenKicksXR,
}) => {
  const [comingSoonService, setComingSoonService] = useState<string | null>(null);
  const [kicksLogoError, setKicksLogoError] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-[#000E2B] text-white flex flex-col justify-between px-5 sm:px-6 py-6 sm:py-8 select-none">
      {/* Top Bar */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="min-h-[44px] px-3.5 rounded-xl border border-white/20 bg-[#00143B]/80 hover:bg-[#001C52] active:scale-[0.97] transition-all flex items-center gap-2 text-sm font-medium text-white whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Inicio</span>
        </button>

        <img
          src={HOMELI_LOGO_URL}
          alt="Homeli"
          referrerPolicy="no-referrer"
          className="h-10 w-auto object-contain"
        />

        <div className="w-[82px]" aria-hidden="true" />
      </header>

      {/* Center Section: 3 Service Access Cards */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-8 gap-6">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-wide text-white">
            Elige un servicio
          </h1>
          <p className="text-sm text-slate-300">
            Selecciona el servicio que necesitas hoy
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Access 1: Kicks XR (Active) */}
          <button
            type="button"
            onClick={onOpenKicksXR}
            className="w-full rounded-2xl border border-white/85 bg-[#00143B]/80 hover:bg-[#001C52]/95 active:scale-[0.98] transition-all duration-150 p-4 flex items-center justify-between gap-4 shadow-lg shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] text-left"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-28 h-14 bg-white rounded-xl px-2.5 py-1.5 flex items-center justify-center shrink-0 shadow-sm">
                {!kicksLogoError ? (
                  <img
                    src={KICKS_XR_LOGO_URL}
                    alt="Kicks XR"
                    referrerPolicy="no-referrer"
                    onError={() => setKicksLogoError(true)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm font-bold text-[#000E2B]">Kicks XR</span>
                )}
              </div>

              <div className="min-w-0">
                <span className="block text-base font-semibold text-white truncate">
                  Kicks XR
                </span>
                <span className="block text-xs text-slate-300 truncate">
                  Limpieza de tenis
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
          </button>

          {/* Access 2: Bomba de agua (Próximamente) */}
          <button
            type="button"
            onClick={() => setComingSoonService('Bomba de agua')}
            className="w-full rounded-2xl border border-white/60 bg-[#00143B]/65 hover:bg-[#001C52]/85 active:scale-[0.98] transition-all duration-150 p-4 flex items-center justify-between gap-4 shadow-lg shadow-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] text-left"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-28 h-14 rounded-xl bg-[#000E2B]/80 border border-white/15 flex items-center justify-center shrink-0">
                <BombaAguaIcon />
              </div>

              <div className="min-w-0">
                <span className="block text-base font-semibold text-white truncate">
                  Bomba de agua
                </span>
                <span className="block text-xs text-slate-400 truncate">
                  Próximamente
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-white/50 shrink-0" />
          </button>

          {/* Access 3: Gas a domicilio (Próximamente) */}
          <button
            type="button"
            onClick={() => setComingSoonService('Gas a domicilio')}
            className="w-full rounded-2xl border border-white/60 bg-[#00143B]/65 hover:bg-[#001C52]/85 active:scale-[0.98] transition-all duration-150 p-4 flex items-center justify-between gap-4 shadow-lg shadow-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] text-left"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-28 h-14 rounded-xl bg-[#000E2B]/80 border border-white/15 flex items-center justify-center shrink-0">
                <GasDomicilioIcon />
              </div>

              <div className="min-w-0">
                <span className="block text-base font-semibold text-white truncate">
                  Gas a domicilio
                </span>
                <span className="block text-xs text-slate-400 truncate">
                  Próximamente
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-white/50 shrink-0" />
          </button>
        </div>
      </main>

      {/* Bottom Indicator Bar (second step highlighted) */}
      <footer className="pt-4 pb-2 flex items-center justify-center">
        <div
          className="w-36 h-1.5 rounded-full bg-[#4A6185] overflow-hidden flex justify-end"
          aria-hidden="true"
        >
          <div className="w-1/2 h-full bg-white rounded-full" />
        </div>
      </footer>

      {/* Modal: Próximamente */}
      {comingSoonService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5"
          onClick={() => setComingSoonService(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-coming-soon-title"
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-[#041842] border border-white/20 p-6 text-center shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F2B84B]/15 border border-[#F2B84B]/40 flex items-center justify-center text-[#F2B84B]">
              <Clock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 id="service-coming-soon-title" className="text-xl font-semibold text-white">
                Próximamente
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                El servicio de <strong className="text-white">{comingSoonService}</strong> estará disponible muy pronto en Homeli.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setComingSoonService(null)}
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
