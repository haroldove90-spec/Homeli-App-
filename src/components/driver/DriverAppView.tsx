import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Truck, MapPin, Navigation, CheckCircle2, QrCode, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";

export const DriverAppView: React.FC = () => {
  const { orders, updateOrderStatus } = useHomeli();
  const [isOnline, setIsOnline] = useState(true);
  const [activeDriverEarnings, setActiveDriverEarnings] = useState(1480);
  const [scannedQrToken, setScannedQrToken] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const pendingDeliveries = orders.filter((o) => o.status === "Listo para recolección" || o.status === "En camino");

  const handleConfirmDeliveryQR = (orderId: string) => {
    updateOrderStatus(orderId, "Entregado");
    setActiveDriverEarnings((e) => e + 120);
    setIsQrModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200 max-w-4xl mx-auto">
      
      {/* Driver Status Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-slate-900 border border-amber-400 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-200" />
            <h2 className="font-bold text-base text-white">Mateo H. (Partner Delivery)</h2>
          </div>
          <div className="text-xs text-orange-100">
            Ganancias de Hoy: <span className="font-black text-amber-300 text-sm">${activeDriverEarnings} MXN</span>
          </div>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2 rounded-2xl font-bold text-xs border transition-all ${
            isOnline
              ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
              : "bg-slate-800 text-slate-300 border-slate-700"
          }`}
        >
          {isOnline ? "🟢 En Línea (Recibiendo)" : "🔴 Fuera de Servicio"}
        </button>
      </div>

      {/* Nearby Delivery Requests */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
          Solicitudes de Entrega Cercanas
        </h3>

        {pendingDeliveries.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
            <Truck className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-500">Buscando nuevas entregas en tu zona...</div>
          </div>
        ) : (
          pendingDeliveries.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-900">
                  Orden #{ord.id} • Ganancia de envío: <span className="text-amber-600">${ord.deliveryFee} MXN</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                  {ord.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Recolectar en Comercio:</span>
                    <span className="text-slate-500">{ord.merchantName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Entregar a Cliente:</span>
                    <span className="text-slate-500">{ord.customerName} ({ord.deliveryAddress})</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ord.deliveryAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 font-bold text-[11px] flex items-center gap-1 border border-slate-200"
                >
                  <Navigation className="w-3.5 h-3.5" /> Google Maps GPS
                </a>

                {ord.status === "Listo para recolección" && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, "En camino", { driverName: "Mateo Hernández" })}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm"
                  >
                    Recolectado • Iniciar Ruta
                  </button>
                )}

                {ord.status === "En camino" && (
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Validar QR Entrega
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Code Delivery Validation Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">Escanear Código QR de Cliente</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa o escanea el token de confirmación entregado por el cliente
              </p>
            </div>

            <input
              type="text"
              placeholder="HOMELI-QR-9421-TOKEN"
              value={scannedQrToken}
              onChange={(e) => setScannedQrToken(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-center font-mono text-xs"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmDeliveryQR(pendingDeliveries[0]?.id || "ORD-9421")}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                Confirmar Entrega
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
