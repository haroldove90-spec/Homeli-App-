import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Order } from "../../types";
import {
  Activity,
  Truck,
  CheckCircle2,
  ChevronRight,
  Wrench,
  MessageSquare,
  ShieldAlert,
  Star,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  MapPin,
  ExternalLink,
  RotateCcw
} from "lucide-react";
import { OrderChatModal } from "../marketplace/OrderChatModal";
import { ProductReviewModal } from "../marketplace/ProductReviewModal";
import { DisputeModal } from "../marketplace/DisputeModal";

export const ActivityView: React.FC = () => {
  const {
    orders,
    bookings,
    setActiveTrackOrder,
    setActiveTrackBooking,
    confirmOrderDelivery
  } = useHomeli();

  // Modals state
  const [chatOrder, setChatOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [disputeOrder, setDisputeOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  const handleCopyTracking = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 1800);
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200 max-w-4xl mx-auto text-slate-900">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-600" />
            Actividad, Envíos & Garantía
          </h2>
          <p className="text-xs text-slate-500">
            Seguimiento de pedidos estilo MercadoEnvíos, chat post-venta y Compra Protegida
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-600" />
            Compras & Paquetes ({orders.length})
          </h3>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Compra Protegida 30 Días
          </span>
        </div>

        {orders.map((ord) => {
          const isDelivered = ord.status === "Entregado";
          const isDisputed = ord.status === "En disputa";

          return (
            <div
              key={ord.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{ord.id}</span>
                    <span className="text-xs text-slate-500">• {ord.merchantName}</span>
                  </div>

                  {/* Tracking Code with 1-click Copy */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>Guía:</span>
                    <button
                      onClick={(e) => handleCopyTracking(e, ord.trackingNumber || ord.id)}
                      className="font-mono font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                      title="Copiar número de guía"
                    >
                      {ord.trackingNumber || ord.id}
                      {copiedTracking === (ord.trackingNumber || ord.id) ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    <span className="text-slate-400">• {ord.createdAt}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  {ord.escrowStatus === "in_escrow" && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      Escrow Retenido (${ord.escrowAmount} MXN)
                    </span>
                  )}
                  {ord.escrowStatus === "released" && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      Pago Liberado al Vendedor
                    </span>
                  )}
                  {ord.escrowStatus === "refunded" && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                      Reembolsado 100%
                    </span>
                  )}
                  {ord.escrowStatus === "disputed" && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                      En Arbitraje Homeli
                    </span>
                  )}

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isDelivered
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : isDisputed
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex gap-3 items-center">
                {ord.items.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={i.image}
                      alt={i.title}
                      className="w-14 h-14 object-cover rounded-2xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">{i.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {i.quantity}x • ${i.price} MXN c/u • Total:{" "}
                        <strong className="text-amber-700 font-black">${ord.totalAmount} MXN</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking Stepper (MercadoLibre style) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Etapas de Entrega MercadoEnvíos
                  </span>
                  <button
                    onClick={() => setActiveTrackOrder(ord)}
                    className="text-violet-600 hover:text-violet-700 font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Ver Mapa GPS en Vivo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Milestone Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-medium">
                    <div className="font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> Pago Seguro
                    </div>
                    <span className="text-[9px] text-slate-500">Escrow Protegido</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border font-medium ${
                      ord.status !== "Nuevo"
                        ? "bg-white border-emerald-200 text-emerald-800"
                        : "bg-white/60 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      {ord.status !== "Nuevo" ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      Preparando
                    </div>
                    <span className="text-[9px] text-slate-500">Bodega Comercio</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border font-medium ${
                      ord.status === "En camino" || isDelivered
                        ? "bg-white border-emerald-200 text-emerald-800"
                        : "bg-white/60 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      {ord.status === "En camino" || isDelivered ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      En Reparto
                    </div>
                    <span className="text-[9px] text-slate-500">{ord.driverName || "Repartidor Partner"}</span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border font-medium ${
                      isDelivered
                        ? "bg-white border-emerald-200 text-emerald-800"
                        : "bg-white/60 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      {isDelivered ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      Entregado
                    </div>
                    <span className="text-[9px] text-slate-500">{ord.deliveredAt || "Pendiente"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar (Chat, Review, Confirm, Dispute) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {/* Chat Post-Venta */}
                  <button
                    onClick={() => setChatOrder(ord)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chat con Vendedor</span>
                  </button>

                  {/* Calificar Producto (Solo si está entregado o no calificado) */}
                  {isDelivered && !ord.isReviewSubmitted && (
                    <button
                      onClick={() => setReviewOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Calificar Producto</span>
                    </button>
                  )}

                  {ord.isReviewSubmitted && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                      ✓ Ya Calificaste este Producto
                    </span>
                  )}

                  {/* Confirm Delivery if in transit */}
                  {ord.status === "En camino" && (
                    <button
                      onClick={() => confirmOrderDelivery(ord.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Ya Recibí mi Pedido</span>
                    </button>
                  )}
                </div>

                {/* Dispute / Claim Button (Compra Protegida) */}
                {!isDisputed ? (
                  <button
                    onClick={() => setDisputeOrder(ord)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline ml-auto"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Necesito ayuda / Abrir Reclamo</span>
                  </button>
                ) : (
                  <span className="text-xs text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Reclamo #{ord.claimId || "ACTIVO"} en revisión
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="space-y-4 pt-4">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-teal-600" />
          Servicios del Hogar Agendados ({bookings.length})
        </h3>

        {bookings.map((bkg) => (
          <div
            key={bkg.id}
            onClick={() => setActiveTrackBooking(bkg)}
            className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 cursor-pointer transition-all space-y-3 shadow-sm hover:shadow-md"
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
              <span>Ver Ubicación Técnico GPS en Vivo</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Modals */}
      {chatOrder && <OrderChatModal order={chatOrder} onClose={() => setChatOrder(null)} />}
      {reviewOrder && <ProductReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} />}
      {disputeOrder && <DisputeModal order={disputeOrder} onClose={() => setDisputeOrder(null)} />}

    </div>
  );
};
