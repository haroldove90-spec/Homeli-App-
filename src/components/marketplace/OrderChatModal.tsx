import React, { useState, useRef, useEffect } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Order } from "../../types";
import { MessageSquare, Send, X, ShieldCheck, Store, User, Paperclip, Truck, Clock } from "lucide-react";

interface OrderChatModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderChatModal: React.FC<OrderChatModalProps> = ({ order, onClose }) => {
  const { orderMessages, sendOrderMessage, currentRole, user } = useHomeli();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for this order
  const messages = orderMessages.filter((m) => m.orderId === order.id);

  const quickReplies = [
    "¿A qué hora estiman la entrega?",
    "Por favor tocar el interfón 402",
    "¿Viene con sello de seguridad?",
    "Confirmación de recepción recibida, gracias"
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendOrderMessage(order.id, text.trim());
    setInputText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[560px] text-slate-900">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  Chat Post-Venta • {order.merchantName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  {order.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                Guía: {order.trackingNumber || "HML-TRK-PENDIENTE"} • {order.status}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Banner */}
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-[11px] text-emerald-900">
          <span className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            Compra Protegida activa: tus mensajes quedan registrados para arbitraje.
          </span>
          <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded-full font-bold">
            Escrow Seguro
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <p className="text-xs">No hay mensajes previos para este pedido.</p>
              <p className="text-[11px]">Escribe un mensaje al comercio para coordinar detalles de tu entrega.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe =
                (currentRole === "B2C" && msg.senderRole === "B2C") ||
                (currentRole === "B2B" && msg.senderRole === "B2B") ||
                (currentRole === "ADMIN" && msg.senderRole === "ADMIN");

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium px-1">
                    <span>{msg.senderName}</span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                      isMe
                        ? "bg-amber-500 text-slate-950 font-medium rounded-tr-xs"
                        : "bg-white border border-slate-200 text-slate-900 rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Adjunto"
                        className="mt-2 rounded-xl max-h-40 object-cover border border-black/10"
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick reply suggestion chips */}
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qr)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 whitespace-nowrap transition-colors border border-slate-200"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Escribe a ${order.merchantName}...`}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-40 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
