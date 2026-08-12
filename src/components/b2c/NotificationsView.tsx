import React from "react";
import { Bell, Truck, Wrench, Gift, ShieldCheck } from "lucide-react";

export const NotificationsView: React.FC = () => {
  const notifications = [
    {
      id: "n1",
      icon: Truck,
      color: "text-amber-700 bg-amber-100",
      title: "Tu pedido ORD-9421 está en camino",
      desc: "El repartidor Mateo Hernández ha recolectado tus productos en Mueblería Mōdern.",
      time: "Hace 5 min"
    },
    {
      id: "n2",
      icon: Wrench,
      color: "text-teal-700 bg-teal-100",
      title: "Servicio de Plomería confirmado",
      desc: "Don Carlos ha aceptado tu cita para hoy a las 16:00 PM.",
      time: "Hace 1 hora"
    },
    {
      id: "n3",
      icon: Gift,
      color: "text-purple-700 bg-purple-100",
      title: "¡Ganaste +120 Puntos Homeli!",
      desc: "Por tu última compra en el marketplace recibiste puntos canjeables por cupones.",
      time: "Hace 3 horas"
    }
  ];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            Notificaciones
          </h2>
          <p className="text-xs text-slate-500">Alertas en tiempo real sobre tu cuenta, pedidos y ofertas</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className={`p-2.5 rounded-2xl ${n.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900 truncate">{n.title}</h3>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
