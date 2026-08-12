import React from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Activity, Clock, MapPin, Truck, CheckCircle2, ChevronRight, Wrench } from "lucide-react";

export const ActivityView: React.FC = () => {
  const { orders, bookings, setActiveTrackOrder, setActiveTrackBooking } = useHomeli();

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet-600" />
          Actividad & Pedidos En Vivo
        </h2>
        <p className="text-xs text-slate-500">Seguimiento en tiempo real de tus pedidos y servicios agendados</p>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Pedidos de Productos</h3>

        {orders.map((ord) => (
          <div
            key={ord.id}
            onClick={() => setActiveTrackOrder(ord)}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-500 cursor-pointer transition-all space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-xs text-slate-900">{ord.id} • {ord.merchantName}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                {ord.status}
              </span>
            </div>

            <div className="text-xs text-slate-700">
              {ord.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.quantity}x {i.title}</span>
                  <span className="font-bold text-amber-700">${i.price * i.quantity} MXN</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-violet-600 font-bold">
              <span>Rastrear GPS en Vivo</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Servicios Agendados</h3>

        {bookings.map((bkg) => (
          <div
            key={bkg.id}
            onClick={() => setActiveTrackBooking(bkg)}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 cursor-pointer transition-all space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-xs text-slate-900">{bkg.id} • {bkg.serviceName}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200">
                {bkg.status}
              </span>
            </div>

            <div className="text-xs text-slate-700">
              <div>Especialista: <span className="font-bold text-slate-900">{bkg.providerName}</span></div>
              <div className="text-slate-500">Fecha: {bkg.date} a las {bkg.time}</div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-teal-600 font-bold">
              <span>Ver Ubicación Técnico GPS</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
