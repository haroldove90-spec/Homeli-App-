import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Order } from "../../types";
import { ShieldAlert, X, AlertTriangle, CheckCircle2, Camera, ShieldCheck, ArrowRight } from "lucide-react";

interface DisputeModalProps {
  order: Order;
  onClose: () => void;
  onDisputeOpened?: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ order, onClose, onDisputeOpened }) => {
  const { openDispute } = useHomeli();
  const [reason, setReason] = useState<string>("Producto dañado o roto");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    "Producto dañado o roto",
    "No coincide con modelo 3D/descripción",
    "Paquete no recibido",
    "Faltan piezas o accesorios",
    "Llegó un producto diferente"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    openDispute(order.id, reason, description.trim(), photoUrl.trim() || undefined);
    setSubmitted(true);
    if (onDisputeOpened) onDisputeOpened();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-5 text-slate-900 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Iniciar Reclamo / Devolución</h3>
              <p className="text-[11px] text-slate-500">Garantía Compra Protegida • {order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900">Reclamo Abierto Exitosamente</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hemos retenido el dinero del pedido en la cuenta de custodia (Escrow). El vendedor y nuestro equipo de arbitraje Super Admin han sido notificados.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 text-left space-y-1.5">
              <div className="font-bold text-slate-900">Pasos a seguir:</div>
              <div>1. El vendedor responderá por el chat post-venta en un máximo de 48 hrs.</div>
              <div>2. Si no hay solución satisfactoria, el Super Admin reembolsará el 100% a tu Billetera Homeli.</div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Compra Protegida Guarantee card */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs">Protegido por Compra Protegida Homeli</div>
                <div className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                  Monto protegido: <strong>${order.totalAmount} MXN</strong>. El dinero permanece congelado hasta resolver el caso.
                </div>
              </div>
            </div>

            {/* Order item preview */}
            <div className="text-slate-600 text-[11px] pb-1">
              Comercio: <span className="font-bold text-slate-900">{order.merchantName}</span> • Guía:{" "}
              <span className="font-mono font-semibold text-slate-800">{order.trackingNumber}</span>
            </div>

            {/* Reason selector */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                ¿Cuál es el problema con tu compra? <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {reasons.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Description details */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                Explica detalladamente qué sucedió <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el estado en el que recibiste el paquete, defectos o inconsistencias..."
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Evidence photo URL */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span>Foto de evidencia / daño (Opcional)</span>
                <span className="text-[10px] text-slate-400">URL pública</span>
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/evidencia.jpg"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enviar Reclamo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
