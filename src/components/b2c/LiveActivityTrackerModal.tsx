import React, { useState, useEffect } from "react";
import { Order, ServiceBooking } from "../../types";
import { Activity, MapPin, Phone, MessageSquare, CheckCircle2, Clock, Truck, UserCheck, Navigation, X } from "lucide-react";

interface LiveActivityTrackerModalProps {
  order?: Order | null;
  booking?: ServiceBooking | null;
  onClose: () => void;
}

export const LiveActivityTrackerModal: React.FC<LiveActivityTrackerModalProps> = ({ order, booking, onClose }) => {
  const [simulatedProgress, setSimulatedProgress] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress((p) => (p >= 100 ? 100 : p + 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!order && !booking) return null;

  const isOrder = !!order;
  const title = isOrder ? `Pedido ${order.id}` : `Servicio ${booking?.id}`;
  const providerOrDriver = isOrder ? order.driverName || "Mateo Hernández (Repartidor Partner)" : booking?.providerName;
  const status = isOrder ? order.status : booking?.status;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-900 space-y-4 p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                {title}
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  En Vivo GPS
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Seguimiento en tiempo real</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Map Viewport */}
        <div className="relative h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
          {/* Grid lines simulating map */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40" />
          
          {/* Animated Route Line */}
          <div className="absolute w-3/4 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 rounded-full" />

          {/* Start Point Pin */}
          <div className="absolute left-8 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
              🏬
            </div>
            <span className="text-[9px] text-slate-600 mt-1 font-semibold">Comercio</span>
          </div>

          {/* Moving Driver / Specialist Pin */}
          <div
            className="absolute transition-all duration-1000 flex flex-col items-center z-10"
            style={{ left: `${simulatedProgress}%` }}
          >
            <div className="p-2 rounded-full bg-amber-500 text-slate-950 shadow-md ring-4 ring-white animate-bounce">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-amber-900 font-bold bg-white px-2 py-0.5 rounded-full border border-amber-300 shadow-sm mt-1">
              {providerOrDriver?.split(" ")[0]}
            </span>
          </div>

          {/* End Point Pin */}
          <div className="absolute right-8 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
              🏠
            </div>
            <span className="text-[9px] text-slate-600 mt-1 font-semibold">Tu Casa</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-slate-800">Estado Actual: <span className="text-amber-700">{status}</span></div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Aceptado
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" /> En Camino
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" /> Entregado
            </div>
          </div>
        </div>

        {/* Contact Provider / Driver */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              👨‍🔧
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">{providerOrDriver}</div>
              <div className="text-[10px] text-slate-500">Verificado Homeli • 4.9 ★</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+522226285414"
              className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
              title="Llamar"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => alert("Abriendo chat directo con especialista...")}
              className="p-2.5 rounded-xl bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors"
              title="Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
